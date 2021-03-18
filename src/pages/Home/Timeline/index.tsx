import { CloseOutlined } from "@ant-design/icons";
import { Timeline as AntdTimeline, Avatar as AntdAvatar } from "antd";
import React, { useState } from "react";

import { Box } from "components/Box";
import { RESUME } from "config/resume";
import { useIsMobileWindowSize } from "hooks/useWindowSize";
import { Avatar } from "pages/Home/Timeline/Avatar";
import { isSet } from "utils/general";

const Content = ({
  date,
  label,
  location,
  index,
  setCurrentIndex,
  isSelected,
  isSelectable,
}: {
  index: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  isSelectable: boolean;
  isSelected: boolean;
  date?: string;
  label?: string;
  location?: string;
}) => {
  return (
    <Box
      style={{
        display: "inline-block",
        marginTop: -8,
        padding: "8px",
        border: "1px solid transparent",
        borderRadius: 2,
        cursor: isSelectable ? "pointer" : undefined,
        transition: "all 0.2s",
        backgroundColor: isSelected ? "#ffffff" : undefined,
        borderColor: isSelected ? "#f0f0f0" : undefined,
        position: "relative",
      }}
      pseudoClasses={{
        hover: isSelectable
          ? { backgroundColor: "#ffffff", borderColor: "#f0f0f0" }
          : {},
      }}
      onClick={() => {
        if (isSelectable) {
          setCurrentIndex((old) => (old === index ? undefined : index));
        }
      }}
    >
      {isSelected && (
        <Box
          style={{
            position: "absolute",
            top: -12,
            right: -8,
          }}
        >
          <AntdAvatar size={16} icon={<CloseOutlined />} />
        </Box>
      )}
      <Box style={{ color: "grey", fontSize: "small" }}>{date}</Box>
      <Box style={{ fontWeight: 600 }}>{label}</Box>
      <Box style={{ color: "grey", fontSize: "small" }}>{location}</Box>
    </Box>
  );
};

export const Timeline = () => {
  const isMobileWindowSize = useIsMobileWindowSize();
  const [currentIndex, setCurrentIndex] = useState<number>();

  return (
    <AntdTimeline
      mode={isMobileWindowSize ? undefined : "alternate"}
      pending={
        <Box style={{ marginLeft: 8 }}>
          <Box as="span" style={{ fontWeight: 600 }}>
            Nicolas Sayer
          </Box>{" "}
          <Box as="span" style={{ color: "grey", fontSize: "small" }}>
            • nicolas@sayer.fr
          </Box>
        </Box>
      }
      pendingDot={<Avatar />}
      reverse
    >
      {RESUME.map(({ label, date, location, description, color }, index) => {
        const isSelectable = Boolean(description);
        const isSelected = currentIndex === index;
        const isNotSelected = isSet(currentIndex) && currentIndex !== index;

        return (
          <AntdTimeline.Item
            key={index}
            color={color}
            style={{
              transition: "all 0.2s",
              opacity: isNotSelected ? 0.2 : undefined,
            }}
            label={
              isMobileWindowSize ? undefined : (
                <Content
                  label={label}
                  date={date}
                  location={location}
                  isSelected={isSelected}
                  setCurrentIndex={setCurrentIndex}
                  index={index}
                  isSelectable={isSelectable}
                />
              )
            }
          >
            <Box
              style={{
                minHeight: 80,
              }}
            >
              {isMobileWindowSize && (
                <Content
                  date={date}
                  label={label}
                  location={location}
                  isSelected={isSelected}
                  setCurrentIndex={setCurrentIndex}
                  index={index}
                  isSelectable={isSelectable}
                />
              )}
              {isSelected && (
                <Box style={{ padding: isMobileWindowSize ? 8 : undefined }}>
                  {description}
                </Box>
              )}
            </Box>
          </AntdTimeline.Item>
        );
      })}
    </AntdTimeline>
  );
};
