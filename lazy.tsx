import * as React from "react";
import * as ReactDOM from "react-dom";

type LazyProps = { username: string } & (
  | { isError?: false; repos: RepoApi[] }
  | { isError: true; error: string }
);

const excluded = new Set(["tuxguitar"]);

const ReposList = ({ repos = [] as RepoApi[] }) => (
  <div>
    {repos.map((repo) => (
      <div className="entry" key={repo.name}>
        <div className="content">
          <a href={repo.html_url}>
            <h2>
              {repo.name}{" "}
              {repo.fork ? (
                <span className="grayed smaller">(forked) </span>
              ) : (
                ""
              )}
            </h2>
          </a>
          <p>{repo.description}</p>
        </div>
        <ul className="list-unstyled">
         
          {repo.homepage ? (
            <li>
              <a href={repo.homepage}>
                {repo.homepage.indexOf("github.io") >= 0
                  ? "Hosted Version"
                  : "Homepage"}
              </a>
            </li>
          ) : (
            <></>
          )}
        </ul>
        <span className="grayed">{getFooters(repo).join(" | ")}</span>
        <hr />
      </div>
    ))}
  </div>
);
const LazyHomepage = (p: LazyProps) => (
  <div>
    <button
      className="btn btn-default btn-sm pull-right"
      onClick={(e) => {
        e.preventDefault();
        loadUser(prompt("Enter username") || "phiresky");
      }}
    >
      Change User
    </button>
    <h1>
      <a href={`https://github.com/${username}`}>
        <img
          height={39}
          width={39}
          src={!p.isError && p.repos[0] ? p.repos[0].owner.avatar_url : ""}
        />{" "}
        {username}
      </a>
      's public GitHub repositories
    </h1>
    <p>
      Ordered by last change. Automatically generated using{" "}
      <a href="https://github.com/phiresky/phiresky.github.io">itself</a>.
    </p>
    <hr />
    {p.isError ? (
      <div className="alert alert-danger">{p.error}</div>
    ) : (
      <>
        <ReposList repos={p.repos.filter(e => !excluded.has(e.name))} />
        {p.repos.length === 100 && <>(... and more)</>}
      </>
    )}
  </div>
);

type ReposApi = Array<RepoApi>;
interface RepoApi {
  name: string;
  updated_at: string;
  language: string;
  size: number;
  stargazers_count: number;
  created_at: string;
  fork: boolean;
  description: string;
  html_url: string;
  homepage: string;
  owner: { avatar_url: string };
}

function timeSince(date: Date) {
  var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function getFooters(repo: RepoApi) {
  const footers: string[] = [];
  footers.push("Updated " + timeSince(new Date(repo.updated_at)) + " ago");
  if (repo.language) footers.push(repo.language);
  if (repo.stargazers_count) footers.push(repo.stargazers_count + " stars");
  footers.push(
    "Created on " + new Date(repo.created_at).toISOString().slice(0, 10)
  );
  return footers;
}
function loadUser(username: string, updateQueryString = true) {
  if (updateQueryString) history.pushState("obj", "newtitle", "?" + username);
  fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=1000`
  )
    .then((resp) => {
      if (resp.ok) return resp.json();
      throw Error(`${resp.status} ${resp.statusText}`);
    })
    .then((repos: ReposApi) =>
      ReactDOM.render(
        <LazyHomepage username={username} repos={repos} />,
        document.querySelector("#root")
      )
    )
    .catch((error) => {
      ReactDOM.render(
        <LazyHomepage username={username} isError error={error + ""} />,
        document.querySelector("#root")
      );
      throw error;
    });
}
const domainMatch = location.host.match(/([a-z]+)\.github\.io/);
const username =
  (location.search && location.search.substring(1)) ||
  (domainMatch && domainMatch[1]) ||
  "phiresky";
loadUser(username, false);
