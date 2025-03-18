"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ComponentSidebar() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleFrameworkChange = (framework: string) => {
    setSelectedFrameworks((prev) => {
      if (prev.includes(framework)) {
        return prev.filter((f) => f !== framework);
      } else {
        return [...prev, framework];
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      <Accordion
        type="multiple"
        defaultValue={["frameworks", "categories"]}
        className="space-y-4"
      >
        <AccordionItem value="frameworks">
          <AccordionTrigger className="text-base font-medium">
            Frameworks
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["React", "SwiftUI"].map((framework) => (
                <div key={framework} className="flex items-center space-x-2">
                  <Checkbox
                    id={`framework-${framework}`}
                    checked={selectedFrameworks.includes(framework)}
                    onCheckedChange={() => handleFrameworkChange(framework)}
                  />
                  <Label
                    htmlFor={`framework-${framework}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {framework}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["UI Elements", "Forms", "Navigation", "Animations"].map(
                (category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pricing">
          <AccordionTrigger className="text-base font-medium">
            Pricing
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {["Free", "Premium"].map((price) => (
                <div key={price} className="flex items-center space-x-2">
                  <Checkbox id={`price-${price}`} />
                  <Label
                    htmlFor={`price-${price}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {price}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
          Reset Filters
        </button>
      </div>
    </div>
  );
}
