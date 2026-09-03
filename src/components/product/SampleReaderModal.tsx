"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, Download } from "lucide-react";

interface SampleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: { title: string; image: string }[];
  initialPageIndex?: number;
}

export default function SampleReaderModal({
  isOpen,
  onClose,
  title,
  pages,
  initialPageIndex = 0,
}: SampleReaderModalProps) {
  const [currentPage, setCurrentPage] = useState(initialPageIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen || pages.length === 0) return null;

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
      setZoomLevel(1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setZoomLevel(1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const activeItem = pages[currentPage] || pages[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-stone-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900/90 border-b border-stone-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C61821] flex items-center justify-center text-white">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base line-clamp-1">
                {title} — Sample Pages
              </h3>
              <p className="text-xs text-stone-400">
                {activeItem.title} (Page {currentPage + 1} of {pages.length})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-800/80 rounded-lg p-1 border border-stone-700 mr-2">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-1 text-stone-300 hover:text-white disabled:opacity-30 rounded hover:bg-stone-700"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-stone-300 px-1 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                className="p-1 text-stone-300 hover:text-white disabled:opacity-30 rounded hover:bg-stone-700"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-auto p-2 sm:p-4 min-h-[300px] sm:min-h-[400px]">
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white disabled:opacity-20 flex items-center justify-center border border-stone-700 shadow-lg transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} className="sm:hidden" />
            <ChevronLeft size={22} className="hidden sm:block" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white disabled:opacity-20 flex items-center justify-center border border-stone-700 shadow-lg transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={18} className="sm:hidden" />
            <ChevronRight size={22} className="hidden sm:block" />
          </button>

          {/* Page Image */}
          <div
            className="transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="relative max-w-full max-h-[70vh] rounded-lg overflow-hidden shadow-2xl bg-white m-2 sm:m-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[60vh] sm:max-h-[65vh] w-auto object-contain select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Strip */}
        <div className="px-3 sm:px-5 py-2 sm:py-3 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            {pages.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentPage(idx);
                  setZoomLevel(1);
                }}
                className={`relative w-12 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                  currentPage === idx
                    ? "border-[#C61821] ring-2 ring-red-500/30 scale-105"
                    : "border-stone-700 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
