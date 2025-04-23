"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "@/app/lib/models/RecordingTestCaseApiResponse";

interface DeviceScreenUIProps {
  screenshotUrl: string;
  menuList: Menu[];
  onMenuHover: (menu: Menu | null, index: number) => void;
  onMenuClick: (menu: Menu, action: string) => void;
  highlightedIndex: number;
  screenshotDimensions: { width: number; height: number };
}

export default function DeviceScreenUI({
  screenshotUrl,
  menuList,
  onMenuHover,
  onMenuClick,
  highlightedIndex,
  screenshotDimensions,
}: DeviceScreenUIProps) {
  const [hoveredMenu, setHoveredMenu] = useState<Menu | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const ACTUAL_WIDTH = screenshotDimensions.width;
  const ACTUAL_HEIGHT = screenshotDimensions.height;
  const DISPLAY_WIDTH = 360;
  const DISPLAY_HEIGHT = 780;

  const parseBounds = (bounds: string) => {
    const match = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (match) {
      const [_, x1, y1, x2, y2] = match;
      return {
        x: parseInt(x1),
        y: parseInt(y1),
        width: parseInt(x2) - parseInt(x1),
        height: parseInt(y2) - parseInt(y1),
      };
    }
    return null;
  };

  const scaleCoordinate = (value: number, actualSize: number, displaySize: number) => {
    return (value / actualSize) * (displaySize-16);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let smallestArea = Infinity;
    let smallestMenu: Menu | null = null;
    let smallestIndex = -1;

    menuList.forEach((menu, index) => {
      if (!menu.bounds) return;
      const bounds = parseBounds(menu.bounds);
      if (!bounds) return;

      const scaledX = scaleCoordinate(bounds.x, ACTUAL_WIDTH, DISPLAY_WIDTH);
      const scaledY = scaleCoordinate(bounds.y, ACTUAL_HEIGHT, DISPLAY_HEIGHT);
      const scaledWidth = scaleCoordinate(bounds.width, ACTUAL_WIDTH, DISPLAY_WIDTH);
      const scaledHeight = scaleCoordinate(bounds.height, ACTUAL_HEIGHT, DISPLAY_HEIGHT);

      if (
        x >= scaledX &&
        x <= scaledX + scaledWidth &&
        y >= scaledY &&
        y <= scaledY + scaledHeight
      ) {
        const area = scaledWidth * scaledHeight;
        if (area < smallestArea) {
          smallestArea = area;
          smallestMenu = menu;
          smallestIndex = index;
        }
      }
    });

    if (smallestMenu) {
      setHoveredMenu(smallestMenu);
      onMenuHover(smallestMenu, smallestIndex);
    } else {
      setHoveredMenu(null);
      onMenuHover(null, -1);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoveredMenu) {
      setSelectedMenu(hoveredMenu);
    }
  };

  return (
    <div className="relative">
      <div
        className="relative"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Image
          src={screenshotUrl}
          alt="Device Screen"
          width={DISPLAY_WIDTH}
          height={DISPLAY_HEIGHT}
          unoptimized
          className="border-8 border-gray-700 rounded-[24] shadow-md"
        />
        {menuList.map((menu, index) => {
          if (!menu.bounds) return null;
          const bounds = parseBounds(menu.bounds);
          if (!bounds) return null;

          const scaledX = scaleCoordinate(bounds.x, ACTUAL_WIDTH, DISPLAY_WIDTH)+8;
          const scaledY = scaleCoordinate(bounds.y, ACTUAL_HEIGHT, DISPLAY_HEIGHT)+8;
          const scaledWidth = scaleCoordinate(bounds.width, ACTUAL_WIDTH, DISPLAY_WIDTH);
          const scaledHeight = scaleCoordinate(bounds.height, ACTUAL_HEIGHT, DISPLAY_HEIGHT);

          return (
            <div
              key={index}
              className={`absolute border-2 ${
                hoveredMenu === menu || index === highlightedIndex
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-transparent"
              }`}
              style={{
                left: scaledX,
                top: scaledY,
                width: scaledWidth,
                height: scaledHeight,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
