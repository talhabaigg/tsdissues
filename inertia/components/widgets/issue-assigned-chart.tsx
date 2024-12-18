"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import IssueAssignedWidget from "./issue-assigned-widget";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
const chartData = [
  { browser: "edge", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
const assignees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@test.com",
    region: "US",
    role: "Admin",
    assigned: 160,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "Jane@test.com",
    region: "US",
    role: "User",
    assigned: 250,
  },
  {
    id: 3,
    name: "testt Doe",
    email: "Jane@test.com",
    region: "US",
    role: "User",
    assigned: 360,
  },
  {
    id: 4,
    name: "test Doe",
    email: "Jane@test.com",
    region: "US",
    role: "User",
    assigned: 500,
  },
  {
    id: 5,
    name: "test Doe",
    email: "Jane@test.com",
    region: "US",
    role: "User",
    assigned: 523,
  },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export function IssueAssignedUsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues assigned to users</CardTitle>
        <CardDescription>
          The below chart displays total issues assigned to users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={assignees}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="assigned" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="assigned"
              layout="vertical"
              radius={5}
              fill="#8884d8"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
