import { CloseOutlined } from "@ant-design/icons";
import { Timeline as AntdTimeline, Avatar as AntdAvatar } from "antd";
import React, { useState } from "react";

import { Box } from "components/Box";
import { RESUME } from "config/resume";
import { useIsMobileWindowSize } from "hooks/useWindowSize";
import { Avatar } from "pages/Home/Timeline/Avatar";
import { isSet } from "utils/general";

export const Timeline = () => {
  const isMobileWindowSize = useIsMobileWindowSize();
  const [currentIndex, setCurrentIndex] = useState<number>();

  return (
    <AntdTimeline
      mode={isMobileWindowSize ? undefined : "alternate"}
      pending
      pendingDot={<Avatar />}
      reverse
    >
      {RESUME.map(({ label, date, location, description, color }, index) => {
        const isSelectable = Boolean(description);
        const isSelected = currentIndex === index;
        const isNotSelected = isSet(currentIndex) && currentIndex !== index;

        return (
          <AntdTimeline.Item
            key={label}
            color={color}
            style={{
              transition: "all 0.2s",
              opacity: isNotSelected ? 0.2 : undefined,
            }}
            label={
              <Box
                style={{
                  display: "inline-block",
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
                    setCurrentIndex((old) =>
                      old === index ? undefined : index
                    );
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
                <Box style={{ color: "grey", fontSize: "small" }}>
                  {location}
                </Box>
              </Box>
            }
          >
            <Box
              style={{
                minHeight: 80,
                paddingBottom: isSelected ? 20 : undefined,
              }}
            >
              {isSelected && description}
            </Box>
          </AntdTimeline.Item>
        );
      })}
    </AntdTimeline>
  );
};
