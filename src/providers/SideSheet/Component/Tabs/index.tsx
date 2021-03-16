import { Avatar, Heading, Pane, Tab, Tablist, Text } from "evergreen-ui";
import React, { useState } from "react";

import { Children } from "providers/SideSheet/Component/Tabs/Children";
import { Details } from "providers/SideSheet/Component/Tabs/Details";
import { Parents } from "providers/SideSheet/Component/Tabs/Parents";
import { Siblings } from "providers/SideSheet/Component/Tabs/Siblings";
import { Spouses } from "providers/SideSheet/Component/Tabs/Spouses";

export const Tabs = ({ relative }: { relative: Record<string, any> }) => {
  const [currenTab, setCurrentTab] = useState(0);
  const data = relative.data();

  return (
    <>
      <Pane>
        <Pane padding={16} borderBottom="muted">
          <Heading size={600} display="flex" alignItems="center">
            <Avatar
              name={`${data.firstName} ${data.lastName}`}
              size={40}
              marginRight={8}
            />
            {data.firstName} {data.lastName}
            <Text size={600} marginLeft={8} marginRight={8} color="muted">
              {data.gender ? "♀" : "♂"}
            </Text>
            {(data.birthDate?.year || data.deathDate?.year) && (
              <Text color="muted">
                (
                {data.birthDate?.year && data.deathDate?.year
                  ? `${data.birthDate.year} → ${data.deathDate.year}`
                  : data.birthDate?.year
                  ? data.birthDate?.year
                  : `? → ${data.deathDate.year}`}
                )
              </Text>
            )}
          </Heading>
        </Pane>
        <Pane display="flex" padding={8} borderBottom="muted">
          <Tablist>
            {["Details", "Parents", "Siblings", "Spouses", "Children"].map(
              (tab, index) => (
                <Tab
                  key={tab}
                  isSelected={currenTab === index}
                  onSelect={() => setCurrentTab(index)}
                >
                  {tab}
                </Tab>
              )
            )}
          </Tablist>
        </Pane>
      </Pane>
      {currenTab === 0 && <Details relative={relative} />}
      {currenTab === 1 && <Parents relative={relative} />}
      {currenTab === 2 && <Siblings relative={relative} />}
      {currenTab === 3 && <Spouses relative={relative} />}
      {currenTab === 4 && <Children relative={relative} />}
    </>
  );
};
