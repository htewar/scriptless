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
    return (value / actualSize) * displaySize;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredIndex = menuList.findIndex((menu) => {
      if (!menu.bounds) return false;
      const bounds = parseBounds(menu.bounds);
      if (!bounds) return false;

      const scaledX = scaleCoordinate(bounds.x, ACTUAL_WIDTH, DISPLAY_WIDTH);
      const scaledY = scaleCoordinate(bounds.y, ACTUAL_HEIGHT, DISPLAY_HEIGHT);
      const scaledWidth = scaleCoordinate(bounds.width, ACTUAL_WIDTH, DISPLAY_WIDTH);
      const scaledHeight = scaleCoordinate(bounds.height, ACTUAL_HEIGHT, DISPLAY_HEIGHT);

      return (
        x >= scaledX &&
        x <= scaledX + scaledWidth &&
        y >= scaledY &&
        y <= scaledY + scaledHeight
      );
    });

    if (hoveredIndex !== -1) {
      const hovered = menuList[hoveredIndex];
      setHoveredMenu(hovered);
      onMenuHover(hovered, hoveredIndex);
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

          const scaledX = scaleCoordinate(bounds.x, ACTUAL_WIDTH, DISPLAY_WIDTH);
          const scaledY = scaleCoordinate(bounds.y, ACTUAL_HEIGHT, DISPLAY_HEIGHT);
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
      {/* {selectedMenu && (
        <div className="absolute top-0 right-0 bg-white p-2 rounded shadow-lg">
          <div className="font-semibold">{selectedMenu.title || selectedMenu.label}</div>
          <div className="text-sm text-gray-600">
            {selectedMenu.type} - {selectedMenu.resourceId}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedMenu.actions?.map((action, index) => (
              <button
                key={index}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                onClick={() => {
                  onMenuClick(selectedMenu, action);
                  setSelectedMenu(null);
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
} 