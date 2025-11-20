import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";

const HeaderBar = ({
  title,
  subTitle,
  titleSearch,
  placeholderSearch,
  buttonText,
  groupSearch,
  handleSearch,
  searchTerm,
  setSearchTerm,
  handleOpenDialog,
}) => {
  return (
    <div className="grid gap-5">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-foreground">{title}</h1>
          <p class="text-muted-foreground mt-2">{subTitle}</p>
        </div>
        <Button className="bg-primary text-white" onClick={handleOpenDialog}>
          <Plus className="w-4 h-4" />
          {buttonText}
        </Button>
      </div>
      {groupSearch && (
        <Card className="px-6">
          <div className="leading-none font-semibold">{titleSearch}</div>
          <Input
            className="w-full max-w-md"
            placeholder={placeholderSearch}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchTerm(e.target.value);
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default HeaderBar;
