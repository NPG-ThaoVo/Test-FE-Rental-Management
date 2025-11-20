import React from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { set } from "lodash";

const TableManagement = ({
  loading,
  titleTable,
  list,
  listColumns,
  handleDeleteRoom,
  loadingDelete,
  handleEditRoom,
  setOpenDialog,
  setIsCreate,
  setFormData,
}) => {
  console.log("list:", list);
  console.log("listColumns:", listColumns);
  return (
    <Card className="px-6">
      <div className="leading-none font-semibold">{titleTable}</div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner className="h-8 w-8 mx-auto" />
        </div>
      ) : (
        <Card className="shadow-none p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {listColumns.map((column) => (
                  <TableHead key={column.key} className="w-[100px]">
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={listColumns.length}
                    className="text-center text-muted-foreground"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
              {list.map((row, index) => (
                <TableRow key={index}>
                  {listColumns.map((column) => (
                    <TableCell key={column.key} className="font-medium">
                      {column.render ? column.render(row) : row[column.key]}
                      {column.key === "action" && (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => {
                              if (handleEditRoom) {
                                // Use custom edit handler if provided (for Bills)
                                handleEditRoom(row);
                              } else {
                                // Fallback to original behavior (for Rooms, Tenants)
                                setOpenDialog(true);
                                setIsCreate(false);
                                setFormData({ ...row });
                              }
                            }}
                            disabled={loadingDelete === row._id}
                            variant="ghost"
                            size="icon"
                          >
                            <SquarePen className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteRoom(row._id)}
                            variant="ghost"
                            size="icon"
                          >
                            {loadingDelete === row._id ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Card>
  );
};

export default TableManagement;
