"use client";

import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import { useCallback, useEffect, useState } from "react";
import {
  TestCase,
  TestCaseApiResponse,
} from "@/app/lib/models/TestCasesApiResponse";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/api/apiClient";
import Cookies from "js-cookie";
import FullScreenSyncLoader from "@/app/lib/ui/components/FullScreenSyncLoader";
import { RefreshCw, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  RecordingTestCaseApiResponse,
} from "@/app/lib/models/RecordingTestCaseApiResponse";
import Image from "next/image";
import { ElementItemView } from "@/app/lib/ui/components/ScreenElementItemView";
import { RoutePaths } from "@/app/lib/utils/routes";
import DeviceScreenUI from "@/app/lib/ui/components/DeviceScreenUI";

export default function RecordTestCase() {
  const router = useRouter();
  const { id } = useParams();
  const [uid, setUid] = useState<string>("");
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testCaseElement, setTestCaseElement] =
    useState<RecordingTestCaseApiResponse | null>(null);
  const [screenShotUrl, setScreenShotUrl] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [key, setKey] = useState(1);
  const refreshImage = () => setKey((prev) => prev + 1);
  const [stepUUID, setStepUUID] = useState<string>("");
  const [isShowAllMenu, setIsShowAllMenu] = useState<boolean>(false);

  // Add useEffect to track stepUUID changes
  useEffect(() => {
    console.log("stepUUID updated to:", stepUUID);
  }, [stepUUID]);

  const fetchTestCase = useCallback(async (uid: string, id: string) => {
    return await apiClient.getTestCase(uid, id);
  }, []);

  const startRecording = useCallback(
    async (action?: {
      action_type: string | null;
      param_value?: string | null;
      assertion_type?: string | null;
      assertion_value?: string | null;
      class?: string | null;
      name?: string | null;
      label?: string | null;
      enabled?: boolean | null;
      visible?: boolean | null;
      xpath?: string | null;
      "resource-id"?: string | null;
      "content-desc"?: string | null;
      title?: string | null;
      text?: string | null;
    }) => {
      setIsLoading(true);
      console.log("Current stepUUID in startRecording:", stepUUID);
      try {
        const response = await apiClient.recording(
          uid,
          testCase?.testCaseUUID as string,
          stepUUID,
          action
        );
        console.log("Recording Response :: ", response);
        if (response != null) {
          return response as RecordingTestCaseApiResponse;
        }
      } catch (error) {
        console.error("Error during recording: ", error);
      }
    },
    [testCase?.testCaseUUID, uid, stepUUID] // Add stepUUID to dependencies
  );

  useEffect(() => {
    if (testCase == null) {
      const uid = Cookies.get("uid") as string;
      if (!uid) {
        router.replace("/");
      }
      setUid(uid);
      setIsLoading(true);
      // refreshImage()
      fetchTestCase(uid, id as string).then((response: TestCaseApiResponse) => {
        setIsLoading(false);
        if (!response.isError) {
          setTestCase(response.data || null);
        }
      });
    }
  }, [testCase, fetchTestCase, id, router]);

  useEffect(() => {
    if (testCase != null && testCaseElement == null) {
      startRecording().then(
        (recordingApiResponse: RecordingTestCaseApiResponse | undefined) => {
          if (recordingApiResponse instanceof RecordingTestCaseApiResponse) {
            const newStepUUID = recordingApiResponse.stepUUID;
            console.log("Setting new stepUUID:", newStepUUID);
            console.log("Recording API Response :: ", recordingApiResponse);
            setStepUUID(newStepUUID);
            setTestCaseElement(recordingApiResponse);
            setScreenShotUrl(
              `${recordingApiResponse.screenshotUrl}?cache-bust=${key}`
            );
            setInitialLoad(false);
            setIsLoading(false);
          }
        }
      );
    }
  }, [testCase, testCaseElement, startRecording]);

  function previewTestCase() {}

  async function onRefreshClick() {
    const actionBody = {
      action_type: "refresh",
      param_value: null,
      class: null,
      name: null,
      title: null,
      "resource-id": null,
      label: null,
      enabled: null,
      visible: null,
      xpath: null,
    };
    refreshImage();
    // setTestCaseElement(null);
    setScreenShotUrl(null);
    const response = await startRecording(actionBody);
    if (response) {
      setTestCaseElement(response);
      setStepUUID(response.stepUUID);
      setIsLoading(false);
      setScreenShotUrl(`${response.screenshotUrl}?cache-bust=${key}`);
    }
  }

  async function saveTestCase() {
    const actionBody = {
      action_type: "exit",
      param_value: "",
      class: "",
      name: "",
      label: "",
      enabled: false,
      visible: false,
      xpath: "",
    };
    startRecording(actionBody);
    router.replace(RoutePaths.TestCases(`mta`));
  }

  const recordStep = async (
    menu: Menu,
    action: string,
    input: string | null
  ) => {
    let actionBody;
    if (action.startsWith("assert_value_")) {
      actionBody = {
        action_type: "value_assertion",
        assertion_type: action.replace("assert_value_", ""),
        assertion_value: input,
        param_value:
          menu.label ||
          menu.title ||
          menu.contentDesc ||
          menu.resourceId ||
          menu.classType ||
          menu.name ||
          menu.type,
        class: menu.type || menu.classType,
        name: menu.name ? menu.name : null,
        label: menu.label ? menu.label : null,
        enabled: menu.enabled,
        visible: menu.visible,
        xpath: menu.xpath ? menu.xpath : null,
        "resource-id": menu.resourceId,
        "content-desc": menu.contentDesc ? menu.contentDesc : null,
      };
    } else if (action.startsWith("assert_regex_")) {
      actionBody = {
        action_type: "regex_assertion",
        assertion_type: action.replace("assert_regex_", ""),
        assertion_value: input,
        param_value:
          menu.label ||
          menu.title ||
          menu.contentDesc ||
          menu.resourceId ||
          menu.classType ||
          menu.name ||
          menu.type,
        class: menu.type || menu.classType,
        name: menu.name ? menu.name : null,
        label: menu.label ? menu.label : null,
        enabled: menu.enabled,
        visible: menu.visible,
        xpath: menu.xpath ? menu.xpath : null,
        "resource-id": menu.resourceId,
        "content-desc": menu.contentDesc ? menu.contentDesc : null,
      };
    } else if (action === "assert_visible") {
      actionBody = {
        action_type: "visibility_assertion",
        assertion_value:
          menu.label ||
          menu.title ||
          menu.contentDesc ||
          menu.resourceId ||
          menu.classType ||
          menu.name ||
          menu.type,
        param_value:
          menu.label ||
          menu.title ||
          menu.contentDesc ||
          menu.resourceId ||
          menu.classType ||
          menu.name ||
          menu.type,
        class: menu.type || menu.classType,
        name: menu.name ? menu.name : null,
        label: menu.label ? menu.label : null,
        enabled: menu.enabled,
        visible: menu.visible,
        xpath: menu.xpath ? menu.xpath : null,
        "resource-id": menu.resourceId,
        "content-desc": menu.contentDesc ? menu.contentDesc : null,
      };
    } else {
      actionBody = {
        action_type: action,
        param_value: input || null,
        class: menu.type || menu.classType,
        name: menu.name ? menu.name : null,
        "resource-id": menu.resourceId,
        "content-desc": menu.contentDesc ? menu.contentDesc : null,
        label: menu.label ? menu.label : null,
        enabled: menu.enabled,
        visible: menu.visible,
        xpath: menu.xpath ? menu.xpath : null,
        title: menu.title ? menu.title : null,
        text: menu.text ? menu.text : null,
      };
    }

    refreshImage();
    setScreenShotUrl(null);
    setIsShowAllMenu(false);
    const response = await startRecording(actionBody);
    if (response) {
      refreshImage();
      setTestCaseElement(response);
      setStepUUID(response.stepUUID);
      setIsLoading(false);
      setScreenShotUrl(`${response.screenshotUrl}?cache-bust=${key}`);
    }
  };

  const showAllClick = async () => {
    setIsShowAllMenu((prev) => !prev);
  };

  return (
    <>
      <Metadata
        seoTitle="Record Test Case | Scriptless"
        seoDescription="Record test case."
      />
      <div className="w-full h-full">
        {isLoading && initialLoad && <FullScreenSyncLoader />}
        {testCase && (
          <RecordingTestCaseScreen
            uniqekey={key}
            testCase={testCase}
            screenshotUrl={screenShotUrl}
            menu={
              isShowAllMenu
                ? testCaseElement?.allMenu || []
                : testCaseElement?.menu || []
            }
            onPreviewTestCaseClick={previewTestCase}
            onRefreshClick={onRefreshClick}
            isRecordingLoading={isLoading}
            onSaveTestCaseClick={saveTestCase}
            onOptionSelect={(
              menu: Menu,
              action: string,
              input: string | null
            ) => {
              let inputAction: string;
              if (action === "Click") inputAction = "click";
              else inputAction = action;
              console.log("Menu Selected :: ", menu, action);
              recordStep(menu, inputAction, input).then(() => {});
            }}
            screenshotDimensions={
              testCaseElement?.screenshotDimensions || {
                width: 1344,
                height: 2992,
              }
            }
            onShowAllClick={showAllClick}
            isShowAllMenu={isShowAllMenu}
          />
        )}
      </div>
    </>
  );
}

interface RecordingTestCaseScreenProp {
  uniqekey: number;
  testCase: TestCase;
  screenshotUrl: string | null;
  menu: Menu[] | [];
  onPreviewTestCaseClick: () => void;
  onRefreshClick: () => void;
  isRecordingLoading: boolean;
  onSaveTestCaseClick: () => void;
  onOptionSelect: (menu: Menu, action: string, input: string | null) => void;
  screenshotDimensions: { width: number; height: number };
  onShowAllClick: () => void;
  isShowAllMenu: boolean;
}

function RecordingTestCaseScreen({
  uniqekey,
  testCase,
  screenshotUrl,
  menu,
  onPreviewTestCaseClick,
  onRefreshClick,
  isRecordingLoading,
  onSaveTestCaseClick,
  onOptionSelect,
  screenshotDimensions,
  onShowAllClick,
  isShowAllMenu,
}: RecordingTestCaseScreenProp) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const handleMenuHover = (menu: Menu | null, index: number) => {
    setHighlightedIndex(index);
  };

  const handleMenuClick = (menu: Menu, action: string) => {
    onOptionSelect(menu, action, null);
  };

  const handleElementHover = (index: number) => {
    setHighlightedIndex(index);
  };

  return (
    <div className={"w-full h-full max-w-4xl mx-auto pt-4 flex flex-col"}>
      <div className={"flex items-center justify-between mb-2"}>
        <div className={"flex items-center gap-2"}>
          <h1 className="text-foreground text-2xl font-bold">
            {testCase.testCaseName}
          </h1>
          <div
            className={
              "flex items-center gap-1 text-sm text-[#c03030] rounded border border-[#c03030] px-1 py-.5"
            }
          >
            <Video size={20} color="#c03030" />
            Recording...
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={onPreviewTestCaseClick}>
            Preview
          </Button>
          <Button onClick={onSaveTestCaseClick}>Save</Button>
        </div>
      </div>
      <Separator />
      <div className="flex-1 flex overflow-y-auto">
        {isRecordingLoading ? (
          <FullScreenSyncLoader />
        ) : (
          <>
            <div className="flex-1">
              <div className="h-full w-full pt-8 flex flex-col items-start gap-2">
                <div className="flex gap-3 items-start justify-center mb-4">
                  <h2 className="font-medium text-xl">Select Element:</h2>
                  <Button className="-mt-1" onClick={() => onRefreshClick()}>
                    <RefreshCw />
                    Refresh
                  </Button>
                  <Button
                    className="-mt-1"
                    onClick={() => onShowAllClick()}
                    variant={isShowAllMenu ? "default" : "outline"}
                  >
                    {isShowAllMenu ? "Show Filtered" : "Show All"}
                  </Button>
                </div>
                {menu.length > 0 && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar flex flex-col items-start gap-2">
                    {menu.map((element, index) => {
                      return (
                        <ElementItemView
                          key={index}
                          index={index}
                          menu={element}
                          isHighlighted={index === highlightedIndex}
                          onOptionSelect={(
                            menu: Menu,
                            action: string,
                            input: string | null
                          ) => {
                            onOptionSelect(menu, action, input);
                          }}
                          onHover={handleElementHover}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 h-full w-full flex items-center justify-center">
              {screenshotUrl && (
                <DeviceScreenUI
                  screenshotUrl={screenshotUrl}
                  menuList={menu}
                  onMenuHover={handleMenuHover}
                  onMenuClick={handleMenuClick}
                  highlightedIndex={highlightedIndex}
                  screenshotDimensions={screenshotDimensions}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
