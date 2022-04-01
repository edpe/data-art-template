import { google } from "googleapis";
import { GetServerSideProps } from "next";
/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import router from "next/router";

const { Bodies, Engine, Events, Render, Runner, World } = Matter;

declare global {
  interface Window {
    engine: Matter.Engine;
    runner: Matter.Runner;
  }
}

function Page({ data }) {
  const [count, setCount] = useState(0);
  const [wallLength, setWallLength] = useState(500);
  const canvas = useRef(null);
  const world = useRef<Matter.World>();
  const engineRef = useRef<Matter.Engine>();
  const runnerRef = useRef<Matter.Runner>();
  const [objectsCount, objectsCountSet] = useState(0);
  const [fps, fpsSet] = useState(0);

  useEffect(() => {
    if (runnerRef.current) {
      Runner.stop(runnerRef.current as Matter.Runner);
      Engine.clear(engineRef.current as Matter.Engine);
    }

    createWorld();

    return () => {
      console.log("clear");
      Runner.stop(runnerRef.current as Matter.Runner);
      Engine.clear(engineRef.current as Matter.Engine);
      router.reload();
    };
  }, [canvas, world]);

  const WIDTH = 1000;
  const HEIGHT = 700;

  function createWorld() {
    const engine = Engine.create();
    engineRef.current = engine;
    world.current = engine.world;

    // create a renderer
    const render = Render.create({
      canvas: canvas.current || undefined,
      engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        background: "#000",
        showCollisions: false,
        showVelocity: false,
        showAxes: false,
        wireframes: false,
      } as Matter.IRendererOptions,
    }) as Matter.Render & { mouse: any };

    const wallBorderWidth = 25;
    const spacing = WIDTH / 7;

    const breadPrice = data[count][3];

    function scale(number, inMin, inMax, outMin, outMax) {
      return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    const sieveBarLength = scale(breadPrice, 52, 108, 0.23, 0.1);

    World.add(engine.world, [
      // the sieve

      Bodies.rectangle(
        spacing,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),

      Bodies.rectangle(
        spacing * 2,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      Bodies.rectangle(
        spacing * 3,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      Bodies.rectangle(
        spacing * 4,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      Bodies.rectangle(
        spacing * 5,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      Bodies.rectangle(
        spacing * 6,
        HEIGHT / 2,
        wallLength * sieveBarLength,
        wallBorderWidth,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      // bottom
      Bodies.rectangle(WIDTH / 2, HEIGHT - 30, WIDTH * 0.93, wallBorderWidth, {
        isStatic: true,
        render: {
          fillStyle: "white",
        },
      }),

      // sides
      Bodies.rectangle(
        WIDTH - wallBorderWidth * 2,
        HEIGHT - HEIGHT / 2,
        wallBorderWidth,
        wallLength,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
      Bodies.rectangle(
        wallBorderWidth * 2,
        HEIGHT - HEIGHT / 2,
        wallBorderWidth,
        wallLength,
        {
          isStatic: true,
          render: {
            fillStyle: "white",
          },
        }
      ),
    ]);

    //
    //
    // After Update
    //
    //
    Events.on(engine, "afterUpdate", (ev) => {
      // const time = engine.timing.timestamp
      objectsCountSet(ev.source.world.bodies.length);

      ev.source.world.bodies.forEach((b) => {
        if (b.position.x > WIDTH || b.position.x < 0 || b.position.y > HEIGHT) {
          World.remove(engine.world, b);
        }
      });
      fpsSet(Math.abs(runner.fps));
    });

    Render.run(render);

    // create runner
    const runner = Runner.create() as Matter.Runner & {
      correction: number;
      counterTimestamp: number;
      delta: number;
      // deltaHistory: number
      deltaMax: number;
      deltaMin: number;
      deltaSampleSize: number;
      enabled: boolean;
      fps: number;
      frameCounter: number;
      frameRequestId: number;
      isFixed: boolean;
      timePrev: number;
      timeScalePrev: number;
    };
    runnerRef.current = runner;
    // run the engine
    Runner.run(runner, engine);

    // add To Global
    window.engine = engine;
    window.runner = runner;
  }

  function generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateBalls(countDirection: string) {
    const engine = window.engine;

    setWallLength(0);

    if (countDirection === "up") {
      setCount(count + 1);
    } else if (countDirection === "down") {
      setCount(count - 1);
    }
    for (let i = 0; i < data[count][4]; i++) {
      World.add(
        engine.world,
        Bodies.circle(generateRandomNumber(0, WIDTH), HEIGHT * 0.1, 10, {
          restitution: 1,
          friction: 0.5,
          density: 0.001,
          render: {
            fillStyle: "#ffff66",
          },
        })
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas className="bg-gray-700" ref={canvas} />
      <div className="mx-3 border select-none border-indigo-600p-3">
        bodies count: {objectsCount}
      </div>
      <div className="mx-3 border select-none border-indigo-600p-3">
        fps: {fps}
      </div>
      <div className="button-container">
        <button
          className="button"
          onClick={() => {
            generateBalls("up");
          }}
        >
          Next month
        </button>
        <button
          className="button"
          onClick={() => {
            generateBalls("down");
          }}
        >
          Previous month
        </button>
      </div>
      <style jsx>{`
        .button-container {
          display: flex;
          justify-content: space-around;
        }

        .button {
          width: 100%;
          margin: 10px;
          height: auto;
          border-radius: 5px;
          border: none;
          background-color: #dcdcdc;
          color: black;
          font-size: 40px;
          cursor: pointer;
          padding: 30px;
        }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = `statsByMonth!A350:F614`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  return {
    props: {
      data: response.data.values,
    },
  };
};

export default Page;
