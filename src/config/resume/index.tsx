import React, { ReactNode } from "react";

import { FortyTwo } from "config/resume/42";
import { EHL } from "config/resume/EHL";
import { Equify } from "config/resume/Equify";
import { HEC } from "config/resume/HEC";
import { HelloGaston } from "config/resume/HelloGaston";
import { IsoPSP } from "config/resume/IsoPSP";
import { Mandarin } from "config/resume/Mandarin";
import { Mongol } from "config/resume/Mongol";
import { Peninsula } from "config/resume/Peninsula";
import { ShakeShack } from "config/resume/ShakeShack";
import { SharePlace } from "config/resume/SharePlace";

export enum Color {
  "blue" = "blue",
  "red" = "red",
  "green" = "green",
  "gray" = "gray",
}

export interface ResumeItem {
  label: string;
  location?: string;
  date?: string;
  description?: ReactNode;
  color?: Color | string;
}

export const RESUME: ResumeItem[] = [
  {
    label: "Iso-PSP",
    location: "Paris, France",
    date: "Sep 2007 → Jun 2008",
    color: Color.red,
    description: <IsoPSP />,
  },
  {
    label: "The Mandarin New York",
    location: "New York City, USA",
    date: "Jul 2011 → Aug 2011",
    color: Color.gray,
    description: <Mandarin />,
  },
  {
    label: "The Peninsula Hong Kong",
    location: "Kowloon, Hong Kong",
    date: "Feb 2013 → Aug 2013",
    color: Color.gray,
    description: <Peninsula />,
  },
  {
    label: "Shake Shack",
    location: "Kuwait City, Kuwait",
    date: "Jan 2015 → Jul 2015",
    color: Color.gray,
    description: <ShakeShack />,
  },
  {
    label: "École hôtelière de Lausanne",
    location: "Lausanne, Switzerland",
    date: "Sep 2012 → Jun 2016",
    color: Color.blue,
    description: <EHL />,
  },
  {
    label: "On the Footsteps of Genghis Khan",
    location: "Ulaanbaatar, Mongolia",
    date: "Jul 2016 → Aug 2016",
    color: Color.gray,
    description: <Mongol />,
  },
  {
    label: "HEC Paris",
    location: "Paris, France",
    date: "Sep 2016 → Jun 2017",
    color: Color.blue,
    description: <HEC />,
  },
  {
    label: "Hello Gaston",
    location: "Paris, France",
    date: "Nov 2016 → Jul 2017",
    color: Color.red,
    description: <HelloGaston />,
  },
  {
    label: "42",
    location: "Paris, France",
    date: "Sep 2017 → May 2018",
    color: Color.blue,
    description: <FortyTwo />,
  },
  {
    label: "Share Place",
    location: "Paris, France",
    date: "Jun 2018 → Oct 2018",
    color: Color.red,
    description: <SharePlace />,
  },
  {
    label: "Equify",
    location: "Paris, France",
    date: "Oct 2018 → Today",
    color: Color.red,
    description: <Equify />,
  },
];
