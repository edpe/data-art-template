import { google } from "googleapis";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import styles from "../styles/Main.module.css";

import Placard from "../src/components/Placard";

const P5comp = dynamic(() => import("react-p5-wrapper"), { ssr: false });

const Main = ({ data }) => {
  const [stats, setStats] = useState(null);
  const [userInteractionComplete, setUserInteractionComplete] = useState(false);

  // tone setup synths and effects
  const synthState = [{ voice: "sine" }, { voice: "triangle" }];

  const synths = [];

  useEffect(() => {
    const reverb = new Tone.Reverb(3);

    synthState.forEach((synthState) =>
      synths.push(
        new Tone.Synth({
          oscillator: {
            type: synthState.voice,
          },
          envelope: {
            attack: 2,
            decay: 0.1,
            sustain: 0.3,
            release: 2,
          },
        }).chain(reverb, Tone.Destination)
      )
    );

    return () => {
      synths.forEach((synth) => synth.triggerRelease());
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // play audio on user interaction, due to Chrome policy not allowing autoplay
      document.addEventListener("click", playAudio);

      const playAudio = () => {
        document.getElementById("audio").play();
        document.removeEventListener("click", playAudio);
      };
    }
  });

  useEffect(() => {
    setStats(data);
    console.log(data);
  }, [data]);

  const sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      synths[0].triggerAttackRelease("C4", "8n");
    };

    p5.draw = () => {
      p5.background(100);
    };
  };

  if (!data) {
    return (
      <div className={styles.container}>
        <p className={styles.text}>Loading data</p>
      </div>
    );
  }

  const handleClick = () => {
    Tone.start();
    setUserInteractionComplete(true);
  };

  if (!userInteractionComplete) {
    return (
      <Placard
        onClick={handleClick}
        link="https://github.com/edpe/data-art-template"
        title="Data Art Template"
        linkText=" Find out more and view the project on Github"
        darkMode
      >
        <p>
          This is where you can add a description about the project. It also
          acts as a point of user interaction, which allows Tone JS to make
          sound as autoplay is disabled by default.
        </p>
      </Placard>
    );
  }

  return (
    <div className={styles.container}>
      <P5comp sketch={sketch} />
    </div>
  );
};

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `statsByMonth!A2:C614`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  return {
    props: {
      data: response.data.values,
    },
  };
}

export default Main;
