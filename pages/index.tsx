import Head from "next/head";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState, useRef } from "react";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactLoading from "react-loading";
import SegmentedControl from "@/components/SegmentedControl";
import Rewrite from "../public/rewrite.svg";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";

const poppins = Poppins({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const [length, setLength] = useState("short");
  const [type, setType] = useState<"Casual" | "Formal">("Casual");
  const [sentence, setSentence] = useState<string>("");
  const [input, setInput] = useState<string>("hi");
  const [isLoading, setIsloading] = useState<boolean>(false);

  const prompt = `rewrite the following "${input}", make sure to keep the same meaning, ${type === "Casual"
    ? "and make sure to make it look Casual"
    : "and make sure to make it look formal"
    }, ${length === "short"
      ? "and make sure to make the sentence look shorter"
      : null
    }`;

  const copy = async () => {
    await navigator.clipboard.writeText(sentence);
    toast("Copied to clipboard", {
      icon: "👏",
    });
  };

  const submit = async (e: any) => {
    setSentence("");
    setIsloading(true);
    const response = await fetch("/api/sentence-rephraser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) return;

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setSentence((prev: string) => prev + chunkValue);
    }
    setIsloading(false);
  };

  return (
    <>
      <Head>
        <title>LexiconAI - Sentence Rephraser</title>
        <meta name="description" content="Generate a new sentence" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="LexiconAI - Sentence Rephraser" />
        <meta
          property="og:description"
          content="Use ChatGPT to improve your writing with personalized suggestions, grammatical corrections, and vocabulary expansion."
        />
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta
          property="og:image"
          content="https://lexiconai.za16.co/og.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script async src="https://cdn.splitbee.io/sb.js" />
      </Head>
      <main>
        <div className="App">
          <Toaster
            toastOptions={{
              style: {
                padding: "12px 24px",
                color: "#0D0D0D",
                background: "#fff",
              },
            }}
          />
          <Navbar />
          <div className="flex flex-col gap-6 items-center w-128 sm:w-10/12">
            <h1 className="flex flex-col gap-6 text-center leading-11 font-bold text-5xl sm:text-4xl">
              Boost your writing using chatGPT
            </h1>
            <div className="flex flex-col w-full gap-2 mt-4">
              <SegmentedControl
                name="group-2"
                callback={(val: "Casual" | "Formal") => setType(val)}
                controlRef={useRef()}
                defaultIndex={0}
                segments={[
                  {
                    label: "Casual",
                    value: "Casual",
                    ref: useRef(),
                  },
                  {
                    label: "Formal",
                    value: "Formal",
                    ref: useRef(),
                  },
                ]}
              />
              <textarea
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  e.key === "Enter" ? submit(e) : null;
                }}
                className="input cursor-text placeholder-grey-60 sm:placeholder:text-sm required:border-1 required:border-err-10"
                required={!input}
                rows={3}
                placeholder="Hello World."
              // disabled={isLoading || !input}
              ></textarea>
              <button
                onClick={(e) => submit(e)}
                className="flex flex-row justify-center items-center gap-1 sm:text-sm disabled:cursor-not-allowed"
                disabled={isLoading || !input}
              >
                {isLoading ? (
                  <ReactLoading
                    width="24px"
                    height="24px"
                    type="bubbles"
                    color="#0D0D0D"
                  />
                ) : (
                  <>
                    <Image src={Rewrite} alt="hi" /> Rewrite
                  </>
                )}{" "}
              </button>
            </div>
            {sentence ? (
              <p
                onClick={copy}
                className="cursor-copy inline-block w-full transition bg-grey-90 hover:bg-grey-80  p-4 border-solid border-2 border-grey-80 rounded-lg mt-4 mb-8 sm:max-w-10/12 sm:text-sm"
              >
                <p className="max-w-auto m-auto">{sentence}</p>
              </p>
            ) : null}
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
