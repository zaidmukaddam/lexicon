import React from "react";
import github from "../public/githubf.svg";
import twitter from "../public/twitter.svg";
import Image from "next/image";

// const github = "../public/githubf.svg";

function Footer() {
  return (
    <div className="footer mb-3">
      <p>
        Powered by{" "}
        <a href="https://ai.com" target={"_blank"}>
          OpenAI's GPT-3
        </a>{" "}
        and{" "}
        <a href="https://vercel.com" target={"_blank"}>
          Vercel Edge Functions.
        </a>
      </p>
      <div className="icons">
        <a target={"_blank"} href="https://github.com/zaidmukaddam">
          <Image alt="Github" src={github} />
        </a>
        <div></div>
        <a target={"_blank"} href="https://twitter.com/zaidmukaddam">
          <Image alt="twitter" src={twitter} />
        </a>
      </div>
    </div>
  );
}

export default Footer;
