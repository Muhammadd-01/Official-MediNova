import React, { useContext } from "react";
import { DarkModeContext } from "../App";

function SocialShare({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const { darkMode } = useContext(DarkModeContext);

  const baseButton =
    "px-4 py-2 rounded-md transition duration-300 text-white";

  const twitterClass = darkMode
    ? "bg-[#1DA1F2] hover:bg-[#0d8ae2]"
    : "bg-teal-400 hover:bg-teal-500";

  const facebookClass = darkMode
    ? "bg-[#4267B2] hover:bg-[#365899]"
    : "bg-teal-600 hover:bg-teal-700";

  const linkedinClass = darkMode
    ? "bg-[#0077B5] hover:bg-[#005f91]"
    : "bg-teal-800 hover:bg-teal-900";

  return (
    <div className="flex flex-wrap gap-3 my-4">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} ${twitterClass}`}
      >
        Share on Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} ${facebookClass}`}
      >
        Share on Facebook
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} ${linkedinClass}`}
      >
        Share on LinkedIn
      </a>
    </div>
  );
}

export default SocialShare;
