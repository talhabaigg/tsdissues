import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AuthenticatedLayout from "~/components/layouts/authenticated-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Head, usePage } from "@inertiajs/react";
import IssueAssignedWidget from "~/components/widgets/issue-assigned-widget";
import { IssueDepartmentChart } from "~/components/widgets/issue-department-chart";
import { IssueAssignedUsersChart } from "~/components/widgets/issue-assigned-chart";
import LatestComments from "~/components/widgets/issue-comments-widget";
import { ScrollArea } from "~/components/ui/scroll-area";
import IssueWidgetByDepartment from "~/components/widgets/issue-widget-by-department";
import IssueActivityBox from "~/components/issue-activity-box";
import { CardTitle, CardDescription } from "~/components/ui/card";

function SortableCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="aspect-video rounded-xl shadow-lg"
    >
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { existingActivities } = usePage().props as unknown as {
    existingActivities: any[];
  };

  const cards = [
    {
      id: "chart-users",
      content: <IssueAssignedUsersChart />,
      title: "Issues Assigned to Users",
      description: "The below chart displays total issues assigned to users.",
    },
    {
      id: "chart-department",
      content: <IssueDepartmentChart />,
      title: "Issues by Department",
      description: "The below chart displays total issues by department.",
    },
    { id: "comments", content: <LatestComments />, title: "Latest Comments" },
    {
      id: "activities",
      content: (
        <div className="p-4 h-[350] sm:h-[450px]">
          <ScrollArea className="h-[300px] sm:h-[400px]">
            <IssueActivityBox existingActivities={existingActivities} />
          </ScrollArea>
        </div>
      ),
      title: "Latest Activity",
    },
  ];

  // const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [cardOrder, setCardOrder] = useState<string[]>(
    () =>
      JSON.parse(localStorage.getItem("dashboardCardOrder") || "null") ||
      cards.map((card) => card.id),
  );
  console.log(cardOrder);
  useEffect(() => {
    // Save the updated order to local storage
    localStorage.setItem("dashboardCardOrder", JSON.stringify(cardOrder));
  }, [cardOrder]);
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCardOrder((prev) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
          <div className="grid auto-rows-min grid-cols-1 gap-2 md:grid-cols-3">
            {cardOrder.map((id) => {
              const card = cards.find((card) => card.id === id);
              return (
                <SortableCard key={id} id={id}>
                  <Card className="p-4">
                    <CardTitle>{card?.title}</CardTitle>
                    <CardDescription>
                      {card?.description || "No description"}
                    </CardDescription>
                    <CardContent>{card?.content}</CardContent>
                  </Card>
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </AuthenticatedLayout>
  );
}
