"use client";

import "regenerator-runtime";
import TextArea from "@/app/_components/inputs/TextArea";
import FileUpload from "@/app/_components/inputs/FileUpload";
import LinkPaste from "@/app/_components/inputs/LinkPaste";
import LanguageSelector from "@/app/_components/inputs/LanguageSelector";
import React, { ChangeEvent, useState } from "react";
import SpeechRecognitionComponent from "@/app/_components/SpeechRecognition/SpeechRecognition";
import {
  IconCopy,
  IconStar,
  IconThumbDown,
  IconThumbUp,
  IconVolume,
} from "@tabler/icons-react";
import { rtfToText } from "@/utils/rtfToText";
import useTranslate from "@/hooks/useTranslate";
import SvgDecorations from "@/app/_components/SvgDecorations";
import CategoryLinks from "@/app/_components/categoryLinks";

export default function Home() {
  const [sourceText, setSourceText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [languages] = useState<string[]>([
    "English",
    "Finnish",
    "Spanish",
    "French",
    "German",
    "Chinese",
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Finnish");

  const targetText = useTranslate(sourceText, selectedLanguage);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rtfContent = reader.result as string;
        const text = rtfToText(rtfContent);
        setSourceText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleLinkPaste = async (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    try {
      const response = await fetch(link);
      const data = await response.text();
      setSourceText(data);
    } catch (error) {
      console.error("Error fetching link content:", error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    // Implement like logic
  };

  const handleDislike = () => {
    // Implement dislike logic
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", targetText);
    } else {
      localStorage.removeItem("favoriteTranslation");
    }
  };

  const handleAudioPlayback = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div>
      <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative over h-screen">
          <div className="max-w-[85rem] mx-auto px-4 sm:p-6 py-10 sm:py-24">
            <div className="text-center">
              <h1 className="text-2xl md:text-6xl font-bold text-neutral-200">
                Traslang <span className="text-[#f87315]">Speak</span>
              </h1>
              <p className="mt-3 text-neutral-400">
                Traslang Speak: Convert your Voice into Text, Connecting the
                world
              </p>
              <div className="mt-12 sm:mt-12 mx-auto max-w-3xl relative">
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <div className="relative z-10 flex flex-col space-x-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                    <TextArea
                      id="source-language"
                      placeholder={"Source language"}
                      value={sourceText}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        setSourceText(e.target.value);
                      }}
                    />
                    <div className="flex flex-row justify-between w-full">
                      <span className="cursor-pointer flex space-x-2 flex-row">
                        <SpeechRecognitionComponent
                          setSourceText={setSourceText}
                        />
                        <IconVolume
                          size={22}
                          onClick={() => handleAudioPlayback(sourceText)}
                        />
                        <FileUpload handleFileUpload={handleFileUpload} />
                        <LinkPaste handleLinkPaste={handleLinkPaste} />
                      </span>
                      <span className="text-sm pr-4">
                        {sourceText.length} / 2000
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col space-x-3 p-3  border rounded-lg shadow-lg  bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                    <TextArea
                      id="target-language"
                      value={targetText}
                      onChange={() => {}}
                      placeholder="Target Language"
                    />
                    <div className="flex flex-row justify-between w-full">
                      <span className="cursor-pointer flex items-center space-x-2 flex-row">
                        <LanguageSelector
                          selectedLanguage={selectedLanguage}
                          setSelectedLanguage={setSelectedLanguage}
                          languages={languages}
                        />
                        <IconVolume
                          size={22}
                          onClick={() => handleAudioPlayback(targetText)}
                        />
                      </span>
                      <div className="flex flex-row items-center space-x-2 pr-4 cursor-pointer">
                        <IconCopy size={22} onClick={handleCopyToClipboard} />
                        {copied && (
                          <span className="text-xs text-green-500">
                            Copied!
                          </span>
                        )}
                        <IconThumbUp size={22} onClick={handleLike} />
                        <IconThumbDown size={22} onClick={handleDislike} />
                        <IconStar
                          size={22}
                          onClick={handleFavorite}
                          className={favorite ? "text-yellow-500" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <SvgDecorations />
              </div>
              <CategoryLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
