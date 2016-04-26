import * as React from 'react';
import * as ReactDOM from 'react-dom';
import moment from 'moment';
import 'fetch';

type LazyProps = { username: string, repos?: RepoApi[], error?: string };

const ReposList = ({repos = [] as RepoApi[]}) => (
    <div>
        {repos.map(repo =>
            <div className="entry" key={repo.name}>
                <div className='content'>
                    <h2>{repo.name} {repo.fork ? <span className='grayed smaller'>(forked) </span> : ""}</h2>
                    <p>{repo.description}</p>
                </div>
                <ul className='list-unstyled'>
                    <li><a href={repo.html_url}>Source Code</a></li>
                    {repo.homepage ? <li><a href={repo.homepage}>{repo.homepage.indexOf("github.io") ? "Hosted Version" : "Homepage"}</a></li> : ""}
                </ul>
                <span className="grayed">{getFooters(repo).join(' | ') }</span>
                <hr/>
            </div>) }
    </div>
);
const LazyHomepage = ({username, repos, error}: LazyProps) => (
    <div>
        <button className="btn btn-default btn-sm pull-right" onClick={e => { e.preventDefault(); loadUser(prompt("Enter username")||"phiresky") } }>Change User</button>
        <h1><a href={`https://github.com/${username}`}><img height={39} width={39} src={repos && repos[0] ? repos[0].owner.avatar_url : ""} /> {username}</a>'s public GitHub repositories</h1>
        <p>Automatically generated using <a href="https://github.com/phiresky/phiresky.github.io">itself</a>.</p>
        <hr/>
        {error ? <div className="alert alert-danger">{error}</div> : ReposList({repos}) }
    </div>
);

type ReposApi = Array<RepoApi>;
interface RepoApi {
    name: string; updated_at: string; language: string; size: number; stargazers_count: number;
    created_at: string; fork: boolean; description: string; html_url: string;
    homepage: string; owner: { avatar_url: string; }
}
function getFooters(repo: RepoApi) {
    const footers: string[] = [];
    footers.push("Updated " + moment(repo.updated_at).fromNow());
    if (repo.language) footers.push(repo.language);
    if (repo.size) footers.push(repo.size + " Lines");
    if (repo.stargazers_count) footers.push(repo.stargazers_count + " Stars");
    footers.push("Created on " + moment(repo.created_at).format("YYYY-MM-DD"))
    return footers;
}
function loadUser(username: string, updateQueryString = true) {
    if(updateQueryString) history.pushState('obj', 'newtitle', "?"+username);
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=1000`)
        .then(resp => {
            if (resp.ok) return resp.json();
            throw Error(`${resp.status} ${resp.statusText}`);
        })
        .then((repos: ReposApi) =>
            ReactDOM.render(<LazyHomepage username={username} repos={repos} />, document.querySelector("#root"))
        ).catch(error => {
            ReactDOM.render(<LazyHomepage username={username} error={error+""} />, document.querySelector("#root"))
            throw error;
        })
}
const domainMatch = location.host.match(/([a-z]+)\.github\.io/);
const username = location.search && location.search.substring(1)
    || (domainMatch && domainMatch[1])
    || "phiresky";
loadUser(username, false);