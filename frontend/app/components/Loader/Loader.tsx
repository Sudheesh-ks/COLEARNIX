"use client";

import "./loader.css";

export default function Loader() {
  return (
    <div className="snl-root">
      <div className="snl-grid" />

      <div className="snl-card">
        <div className="snl-orbit-wrap">
          <div className="snl-core" />
          <div className="snl-orbit snl-orbit-1" />
          <div className="snl-orbit snl-orbit-2" />
          <div className="snl-orbit snl-orbit-3" />
        </div>

        <div className="snl-bar-wrap">
          <div className="snl-bar" />
        </div>
      </div>
    </div>
  );
}