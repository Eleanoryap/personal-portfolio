"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/audio/ambient.mp3";

/**
 * A small ambient-sound toggle in the bottom corner — a spinning disc when it's
 * playing. Never autoplays (browsers block it, and it'd be rude); starts low.
 * The whole control hides itself until the track is confirmed playable, so the
 * site is fine with no audio file present.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.3;
    a.loop = true;

    const onReady = () => setReady(true);
    const onErr = () => setReady(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    a.addEventListener("canplay", onReady);
    a.addEventListener("error", onErr);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("canplay", onReady);
      a.removeEventListener("error", onErr);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }

  return (
    <div className={`music${ready ? "" : " music--off"}`}>
      <audio ref={audioRef} src={SRC} preload="metadata" />
      <button
        type="button"
        className="music__btn"
        onClick={toggle}
        aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}
        aria-pressed={playing}
      >
        <span
          className={`music__disc${playing ? " is-spinning" : ""}`}
          aria-hidden="true"
        />
        {playing ? "Sound on" : "Sound"}
      </button>
    </div>
  );
}
