"use client";

import Metadata from "@/app/lib/ui/components/ComponentMetaData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/app/lib/api/apiClient";
import { BeatLoader } from "react-spinners";
import PDFViewer from "@/app/lib/ui/components/PDFViewer";

const formSchema = z.object({
  teraBlobPath: z.string(),
});

interface Utility {
  name: string;
}

const utilities: Utility[] = [
  { name: "Translation" },
  { name: "Truncation" },
  { name: "RTL" },
];

export default function UtilityPage() {
  const [selectedUtilities, setSelectedUtilities] =
    useState<Utility[]>(utilities);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [terablobLink, setTeraBlobLink] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teraBlobPath: "",
    },
  });
  const validateInputAndRunUtility = () => {
    if (form.getValues("teraBlobPath") === "") {
      setErrorMessage("Please enter a path");
      return;
    }
    if (selectedUtilities.length === 0) {
      setErrorMessage("Please select at least one capability");
      return;
    }
    runUtility();
  };
  const runUtility = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setTeraBlobLink(null);
    const response: string | null = await apiClient.runUtility();
    if (response) {
      setTeraBlobLink(response);
    }
    setIsLoading(false);
    console.log(response);
  };
  return (
    <>
      <Metadata
        seoTitle="Localization | Scriptless"
        seoDescription="Run localization scripts to perform various tasks"
      />
      <div className="h-full w-full flex items-center justify-start">
        <div className="flex flex-1 items-center justify-center">
          <div className="border border-primary py-4 w-[500] px-10 rounded-lg mt-8">
            <h1 className="text-2xl font-bold text-center">
              Localization Runner
            </h1>
            <Separator className="my-4" />
            <div className="w-full flex items-center justify-between mb-2">
              <Label className="mb-2">Select capabilities to run:</Label>
              <div className="flex gap-1 items-center spae-x-2">
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All
                </label>
                <Checkbox
                  id="select-all"
                  checked={selectedUtilities.length === utilities.length}
                  onCheckedChange={(checked) => {
                    setSelectedUtilities(checked ? utilities : []);
                  }}
                />
              </div>
            </div>
            <UtilitySelector
              utilities={utilities}
              selectedUtilities={selectedUtilities}
              onSelect={(utility: Utility) => {
                if (selectedUtilities.includes(utility)) {
                  setSelectedUtilities(
                    selectedUtilities.filter((u) => u !== utility)
                  );
                } else {
                  setSelectedUtilities([...selectedUtilities, utility]);
                }
              }}
            />
            <Form {...form}>
              <div className="mt-4" />
              <FormField
                control={form.control}
                name="teraBlobPath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Path</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Path"
                        type="string"
                        {...field}
                        onChangeCapture={(targetValue) => {
                          field.onChange(targetValue.currentTarget.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-6" />
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => validateInputAndRunUtility()}
                  disabled={isLoading || selectedUtilities.length === 0}
                >
                  {isLoading ? <BeatLoader color="#FFFFFF" /> : "Run"}
                </Button>
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>
            </Form>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center mt-10 mb-10 bg-gray-100 h-full w-full ">
          {terablobLink && <PDFViewer pdfLink={terablobLink} />}
        </div>
      </div>
    </>
  );
}

interface UtilitySelectorProps {
  utilities: Utility[];
  selectedUtilities: Utility[];
  onSelect: (utility: Utility) => void;
}

const UtilitySelector = ({
  utilities,
  selectedUtilities,
  onSelect,
}: UtilitySelectorProps) => {
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {utilities.map((utility) => (
        <div
          key={utility.name}
          className={`${
            selectedUtilities.includes(utility)
              ? "bg-primary text-white"
              : "bg-secondary"
          } px-4 py-2 rounded-md cursor-pointer`}
          onClick={() => onSelect(utility)}
        >
          {utility.name}
        </div>
      ))}
    </div>
  );
};
