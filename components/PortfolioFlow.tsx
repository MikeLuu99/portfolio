"use client";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import type { Node } from "reactflow";
import "reactflow/dist/style.css";
import MainNode from "./MainNode";
import DetailNode from "./DetailNode";

const NODE_OFFSET = 400;
const NODE_POSITIONS = {
  Education: { x: -0.9, y: 0 },
  Links: { x: 1.05, y: 0 },
  Projects: { x: -0.9, y: 0.7 },
  Experiences: { x: 1.05, y: 0.75 },
} as const;

const nodeTypes = {
  main: MainNode,
  detail: DetailNode,
};

const initialNodes: Node[] = [
  {
    id: "main",
    type: "main",
    position: { x: 0, y: 0 },
    data: {
      name: "Mike Luu",
      description: (
        <>
          <p>
            Math and CS Student, interested in databases, automations, and AI
          </p>
          <hr className="my-4" />
          {/* <p>
            Growing a startup in businees process automation with my brother at
            the moment (
            <a
              href="https://mygrid.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Mygrid
            </a>
            ), please fund us.
          </p> */}
          <p>
            Please hire me, I&apos;ll bring you coffee everyday and fix your git
            issues. I can also do massage and resolve merge conflicts.
          </p>
          <hr className="my-4" />
          <p>
            I explore math and film music sometimes. I also try{" "}
            <a
              href="https://yappings.mikeluu.xyz"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              writing
            </a>{" "}
            and{" "}
            <a
              href="https://www.goodreads.com/user/show/184543234-mike-luu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              reading
            </a>{" "}
            to be more &quot;intellectual&quot;.
          </p>
          <hr className="my-4" />
          <p>
            <span
              className="cursor-pointer underline mx-1"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("section-click", { detail: "Education" }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(
                    new CustomEvent("section-click", { detail: "Education" }),
                  );
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Education"
            >
              Education
            </span>{" "}
            |
            <span
              className="cursor-pointer underline mx-1"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("section-click", { detail: "Experiences" }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(
                    new CustomEvent("section-click", { detail: "Experiences" }),
                  );
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Experiences"
            >
              Experiences
            </span>{" "}
            |
            <span
              className="cursor-pointer underline mx-1"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("section-click", { detail: "Projects" }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(
                    new CustomEvent("section-click", { detail: "Projects" }),
                  );
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Projects"
            >
              Projects
            </span>{" "}
            |
            <span
              className="cursor-pointer underline mx-1"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("section-click", { detail: "Links" }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.dispatchEvent(
                    new CustomEvent("section-click", { detail: "Links" }),
                  );
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Links"
            >
              Links
            </span>{" "}
            |
            <a
              href="/bucket-list"
              className="underline mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bucket List
            </a>
          </p>
        </>
      ),
      onSectionClick: () => {},
    },
  },
];

export default function PortfolioFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const proOptions = { hideAttribution: true };

  const onSectionClick = useCallback(
    (section: string) => {
      setNodes((nds) => {
        const mainNode = nds.find((n) => n.id === "main");
        if (!mainNode) return nds;
        const existingNode = nds.find((n) => n.id === section);
        if (existingNode) {
          return nds.filter((n) => n.id !== section);
        }
        const newNode: Node = {
          id: section,
          type: "detail",
          data: { section },
          position: getNodePosition(section, mainNode.position),
        };
        // Create edge from main node to the new section node
        setEdges((eds) => [
          ...eds,
          {
            id: `main-${section}`,
            source: "main",
            target: section,
            type: "default",
          },
        ]);
        return [...nds, newNode];
      });
    },
    [setNodes, setEdges],
  );

  const getNodePosition = (
    section: string,
    mainPosition: { x: number; y: number },
  ) => {
    const position = NODE_POSITIONS[section as keyof typeof NODE_POSITIONS];
    if (!position) return { x: 0, y: 0 };

    return {
      x: mainPosition.x + position.x * NODE_OFFSET,
      y: mainPosition.y + position.y * NODE_OFFSET,
    };
  };

  useEffect(() => {
    const handleSectionClick = (event: CustomEvent<string>) => {
      onSectionClick(event.detail);
    };
    window.addEventListener(
      "section-click",
      handleSectionClick as EventListener,
    );
    return () => {
      window.removeEventListener(
        "section-click",
        handleSectionClick as EventListener,
      );
    };
  }, [onSectionClick]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{
        padding: 0.5,
        minZoom: window.innerWidth < 768 ? 0.6 : 1.25,
        maxZoom: window.innerWidth < 768 ? 0.6 : 1.25,
      }}
      proOptions={proOptions}
    >
      <Background
        variant={BackgroundVariant.Lines}
        gap={12}
        color="#d2c9c0"
        style={{ backgroundColor: "#dfd6cc" }}
      />
      {/* <Controls /> */}
    </ReactFlow>
  );
}
