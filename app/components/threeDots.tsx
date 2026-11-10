"use client"

import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ThreeDotsProps = {
  onView?: () => void
  onEdit?: () => void
  favourite?: boolean
  onToggleFavourite?: () => void
  onDelete?: () => void
  deleteDisabled?: boolean
  menuDisabled?: boolean
}

function hasItems(props: ThreeDotsProps) {
  return Boolean(
    props.onView ??
      props.onEdit ??
      props.onToggleFavourite ??
      props.onDelete
  )
}

export function ThreeDots({
  onView,
  onEdit,
  favourite = false,
  onToggleFavourite,
  onDelete,
  deleteDisabled = false,
  menuDisabled = false,
}: ThreeDotsProps) {
  return (
    <>
      {hasItems({ onView, onEdit, onToggleFavourite, onDelete }) ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More actions"
                title="More actions"
                disabled={menuDisabled}
              >
                <MoreHorizontalIcon className="size-4" />
              </Button>
            }
          />

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              {onView && (
                <DropdownMenuItem onClick={onView}>
                  <EyeIcon className="text-muted-foreground" />
                  View Details
                </DropdownMenuItem>
              )}

              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <PencilIcon className="text-muted-foreground" />
                  Edit Job
                </DropdownMenuItem>
              )}

              {onToggleFavourite && (
                <DropdownMenuItem onClick={onToggleFavourite}>
                  <StarIcon
                    className={
                      favourite
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }
                  />
                  {favourite ? "Remove from Favourites" : "Add to Favourite"}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            {onDelete && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  disabled={deleteDisabled}
                  onClick={onDelete}
                >
                  <Trash2Icon />
                  Delete Job
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  )
}
