import { useEffect } from "react";
import { CallGraph } from "@/api/callgraphs/types";
import { getCommonDateString } from "@/api/utils";
import { Action } from "@/pages/CallGraphPage";
import Cytoscape from "cytoscape";
import { CY_COLOR_NEUTRAL, CY_COLOR_RED } from "@/components/callgraphs/graphs/CytoscapeInstance";

export const useHighlightMethod = (
    cy: Cytoscape.Core | null,
    method: string | null,
    actionsStorage: Action[],
    setActionsStorage: (actions: Action[]) => void,
    removeLookup: () => void
) => {
    useEffect(() => {
        if (cy && method) {
            const node = cy.getElementById(method);
            if (node && node.length > 0) {
                cy.animate({
                    fit: { padding: 300, eles: node },
                    duration: 500,
                });

                setActionsStorage([
                    ...actionsStorage,
                    {
                        id: actionsStorage.length,
                        methodIds: [method],
                        calls: [],
                        timestamp: getCommonDateString(),
                    },
                ]);

                node.addClass("highlighted");
            }
            removeLookup();
        }
    }, [method, cy]);
};

export const useHighlightReachability = (
    cy: Cytoscape.Core | null,
    methodReachabilityCG: CallGraph | null,
    actionsStorage: Action[],
    setActionsStorage: (actions: Action[]) => void
) => {
    useEffect(() => {
        if (!cy) return;

        if (methodReachabilityCG) {
            const actionToStore: Action = {
                id: actionsStorage.length,
                methodIds: [],
                calls: [],
                timestamp: getCommonDateString(),
            };

            methodReachabilityCG.methods.forEach((method) => {
                const node = cy.getElementById(method.methodSignature);
                if (node) {
                    actionToStore.methodIds.push(method.methodSignature);
                    node.addClass("highlighted");
                }
            });

            methodReachabilityCG.calls.forEach((call) => {
                const edge = cy.getElementById(`${call.httpMethod}:${call.source}__${call.target}`);
                if (edge) {
                    actionToStore.calls.push({
                        callId: `${call.httpMethod}:${call.source}__${call.target}`,
                        isInterservice: call.isInterserviceCall
                    });
                    edge.addClass("highlighted")
                }
            });

            setActionsStorage([...actionsStorage, actionToStore]);
        }
    }, [methodReachabilityCG]);
};

export const useHighlightMicroservice = (
    cy: Cytoscape.Core | null,
    msToHighlight: string | null,
    callGraph: CallGraph,
    actionsStorage: Action[],
    setActionsStorage: (actions: Action[]) => void
) => {
    useEffect(() => {
        if (cy && msToHighlight) {
            const highlightedNodes = cy.collection();
            const actionToStore: Action = {
                id: actionsStorage.length,
                methodIds: [],
                calls: [],
                timestamp: getCommonDateString(),
            };

            callGraph.methods
                .filter((method) => method.microservice === msToHighlight)
                .forEach((method) => {
                    const node = cy.getElementById(method.methodSignature);
                    if (node.nonempty()) {
                        actionToStore.methodIds.push(method.methodSignature);
                        node.addClass("highlighted");
                        highlightedNodes.merge(node);
                    }
                });

            setActionsStorage([...actionsStorage, actionToStore]);
            if (highlightedNodes.nonempty()) {
                cy.fit(highlightedNodes, 50);
            }
        }
    }, [msToHighlight]);
};

export const useRemoveAction = (cy: Cytoscape.Core | null, actionToRemove: Action | null) => {
    useEffect(() => {
        if (actionToRemove && cy) {
            actionToRemove.methodIds.forEach((methodId) => {
                const node = cy.getElementById(methodId);
                node.removeClass("highlighted");
            });
            actionToRemove.calls.forEach((call) => {
                const edge = cy.getElementById(call.callId);
                edge.style({
                    "line-color": call.isInterservice ? CY_COLOR_RED : CY_COLOR_NEUTRAL,
                    "target-arrow-color": call.isInterservice
                        ? CY_COLOR_RED
                        : CY_COLOR_NEUTRAL,
                    "line-style": call.isInterservice ? "dashed" : "solid",
                })
            });
        }
    }, [actionToRemove]);
};
