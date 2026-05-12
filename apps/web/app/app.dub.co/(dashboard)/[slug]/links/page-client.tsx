"use client";

import useCurrentFolderId from "@/lib/swr/use-current-folder-id";
import {
  useCheckFolderPermission,
  useFolderPermissions,
} from "@/lib/swr/use-folder-permissions";
import useLinks from "@/lib/swr/use-links";
import useWorkspace from "@/lib/swr/use-workspace";
import { FolderDropdown } from "@/ui/folders/folder-dropdown";
import {
  FolderInfoPanel,
  FolderInfoPanelControls,
} from "@/ui/folders/folder-info-panel";
import { RequestFolderEditAccessButton } from "@/ui/folders/request-edit-button";
import { PageContentWithSidePanel } from "@/ui/layout/page-content/page-content-with-side-panel";
import { PageWidthWrapper } from "@/ui/layout/page-width-wrapper";
import LinkDisplay from "@/ui/links/link-display";
import LinksContainer from "@/ui/links/links-container";
import { LinksDisplayProvider } from "@/ui/links/links-display-provider";
import { useLinkFilters } from "@/ui/links/use-link-filters";
import { useAddEditTagModal } from "@/ui/modals/add-edit-tag-modal";
import { useExportLinksModal } from "@/ui/modals/export-links-modal";
import { useLinkBuilder } from "@/ui/modals/link-builder";
import { ThreeDots } from "@/ui/shared/icons";
import { SearchBoxPersisted } from "@/ui/shared/search-box";
import {
  Button,
  Filter,
  IconMenu,
  Popover,
  Tooltip,
  TooltipContent,
  useRouterStuff,
} from "@dub/ui";
import { Download, Globe, TableIcon, Tag } from "@dub/ui/icons";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function WorkspaceLinksClient() {
  const { folderId } = useCurrentFolderId();

  return (
    <PageContentWithSidePanel
      title={
        <div className="-ml-2">
          <FolderDropdown hideFolderIcon={true} />
        </div>
      }
      controls={<WorkspaceLinksPageControls />}
      sidePanel={
        folderId
          ? {
              title: "Folder",
              content: <FolderInfoPanel />,
              controls: <FolderInfoPanelControls />,
            }
          : undefined
      }
    >
      <LinksDisplayProvider>
        <WorkspaceLinks />
      </LinksDisplayProvider>
    </PageContentWithSidePanel>
  );
}

export function WorkspaceLinksPageControls() {
  const { LinkBuilder, CreateLinkButton } = useLinkBuilder();

  return (
    <>
      <LinkBuilder />
      <div className="hidden sm:block">
        <CreateLinkButton className="h-9" />
      </div>
    </>
  );
}

function WorkspaceLinks() {
  const router = useRouter();
  const { isValidating } = useLinks();
  const searchParams = useSearchParams();
  const workspace = useWorkspace();
  const { LinkBuilder, CreateLinkButton } = useLinkBuilder();
  const { AddEditTagModal, setShowAddEditTagModal } = useAddEditTagModal();

  const {
    filters,
    activeFilters,
    onSelect,
    onRemove,
    onRemoveFilter,
    onRemoveAll,
    setSearch,
    setSelectedFilter,
  } = useLinkFilters();

  const { folderId } = useCurrentFolderId();
  const { isLoading } = useFolderPermissions();
  const canCreateLinks = useCheckFolderPermission(
    folderId,
    "folders.links.write",
  );

  return (
    <>
      <LinkBuilder />
      <AddEditTagModal />
      <div className="flex w-full items-center">
        <PageWidthWrapper className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex w-full grow gap-2 md:w-auto">
              {!workspace.isMegaWorkspace && (
                <div className="grow basis-0 md:grow-0">
                  <Filter.Select
                    filters={filters}
                    activeFilters={activeFilters}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    onSearchChange={setSearch}
                    onSelectedFilterChange={setSelectedFilter}
                    className="w-full"
                    emptyState={{
                      tagIds: (
                        <div className="flex flex-col items-center gap-2 p-2 text-center text-sm">
                          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
                            <Tag className="size-6 text-white/40" />
                          </div>
                          <p className="mt-2 font-medium text-white/80">
                            No tags found
                          </p>
                          <p className="mx-auto mt-1 w-full max-w-[180px] text-white/40">
                            Add tags to organize your links
                          </p>
                          <div>
                            <Button
                              className="mt-1 h-8"
                              onClick={() => setShowAddEditTagModal(true)}
                              text="Add tag"
                            />
                          </div>
                        </div>
                      ),
                      domain: (
                        <div className="flex flex-col items-center gap-2 p-2 text-center text-sm">
                          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
                            <Globe className="size-6 text-white/40" />
                          </div>
                          <p className="mt-2 font-medium text-white/80">
                            No domains found
                          </p>
                          <p className="mx-auto mt-1 w-full max-w-[180px] text-white/40">
                            Add a custom domain to match your brand
                          </p>
                          <div>
                            <Button
                              className="mt-1 h-8"
                              onClick={() =>
                                router.push(
                                  `/${workspace.slug}/settings/domains`,
                                )
                              }
                              text="Add domain"
                            />
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
              )}
              <div className="grow basis-0 md:grow-0">
                <LinkDisplay />
              </div>
            </div>
            <div className="flex gap-x-2 max-md:w-full">
              <div className="w-full md:w-56 xl:w-64">
                <SearchBoxPersisted
                  loading={isValidating}
                  inputClassName="h-10"
                  placeholder={
                    workspace.isMegaWorkspace
                      ? "Search by short link"
                      : "Search by short link or URL"
                  }
                />
              </div>

              {isLoading ? (
                <div className="h-10 w-[2.125rem] animate-pulse rounded-md bg-white/10" />
              ) : canCreateLinks ? (
                <MoreLinkOptions />
              ) : (
                <div className="w-fit">
                  <RequestFolderEditAccessButton
                    folderId={folderId!}
                    workspaceId={workspace.id!}
                    variant="primary"
                  />
                </div>
              )}
            </div>
          </div>
          {activeFilters.length > 0 && (
            <div className="mt-3">
              <Filter.List
                filters={filters}
                activeFilters={activeFilters}
                onSelect={onSelect}
                onRemove={onRemove}
                onRemoveFilter={onRemoveFilter}
                onRemoveAll={onRemoveAll}
              />
            </div>
          )}
        </PageWidthWrapper>
      </div>

      <div className="mt-4">
        <LinksContainer
          CreateLinkButton={canCreateLinks ? CreateLinkButton : () => <></>}
        />
      </div>
    </>
  );
}

const MoreLinkOptions = () => {
  const { queryParams } = useRouterStuff();
  const [openPopover, setOpenPopover] = useState(false);
  const [_state, setState] = useState<"default" | "import">("default");
  const { ExportLinksModal, setShowExportLinksModal } = useExportLinksModal();

  useEffect(() => {
    if (!openPopover) setState("default");
  }, [openPopover]);

  return (
    <>
      <ExportLinksModal />
      <Popover
        content={
          <div className="w-full md:w-52">
            <div className="grid gap-px p-2">
              <p className="mb-1.5 mt-1 flex items-center gap-2 px-1 text-xs font-medium text-white/30">
                Import Links
              </p>
              <ImportOption
                onClick={() => {
                  setOpenPopover(false);
                  queryParams({
                    set: {
                      import: "bitly",
                    },
                  });
                }}
              >
                <IconMenu
                  text="Import from Bitly"
                  icon={
                    <img
                      src="https://assets.dub.co/misc/icons/bitly.svg"
                      alt="Bitly logo"
                      className="h-4 w-4"
                    />
                  }
                />
              </ImportOption>
              <ImportOption
                onClick={() => {
                  setOpenPopover(false);
                  queryParams({
                    set: {
                      import: "rebrandly",
                    },
                  });
                }}
              >
                <IconMenu
                  text="Import from Rebrandly"
                  icon={
                    <img
                      src="https://assets.dub.co/misc/icons/rebrandly.svg"
                      alt="Rebrandly logo"
                      className="h-4 w-4"
                    />
                  }
                />
              </ImportOption>
              <ImportOption
                onClick={() => {
                  setOpenPopover(false);
                  queryParams({
                    set: {
                      import: "short",
                    },
                  });
                }}
              >
                <IconMenu
                  text="Import from Short.io"
                  icon={
                    <img
                      src="https://assets.dub.co/misc/icons/short.svg"
                      alt="Short.io logo"
                      className="h-4 w-4"
                    />
                  }
                />
              </ImportOption>
              <ImportOption
                onClick={() => {
                  setOpenPopover(false);
                  queryParams({
                    set: {
                      import: "csv",
                    },
                  });
                }}
              >
                <IconMenu
                  text="Import from CSV"
                  icon={<TableIcon className="size-4" />}
                />
              </ImportOption>
            </div>
            <div className="border-t border-white/10" />
            <div className="grid gap-px p-2">
              <p className="mb-1.5 mt-1 flex items-center gap-2 px-1 text-xs font-medium text-white/30">
                Export Links
              </p>
              <button
                onClick={() => {
                  setOpenPopover(false);
                  setShowExportLinksModal(true);
                }}
                className="w-full rounded-md p-2 hover:bg-white/10 active:bg-white/15 text-white/70"
              >
                <IconMenu
                  text="Export as CSV"
                  icon={<Download className="h-4 w-4" />}
                />
              </button>
            </div>
          </div>
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
        align="end"
      >
        <Button
          onClick={() => setOpenPopover(!openPopover)}
          variant="secondary"
          className="w-auto px-2"
          icon={<ThreeDots className="h-5 w-5 text-white/30" />}
        />
      </Popover>
    </>
  );
};

function ImportOption({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md p-2 hover:bg-white/10 active:bg-white/15 text-white/70"
    >
      {children}
    </button>
  );
}
