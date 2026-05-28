"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { BlocksBuilderField } from "./BlocksBuilder";
import { Form, useForm } from "@payloadcms/ui";
import { motion, AnimatePresence } from "framer-motion";
import "./BlocksBuilder/styles.css";

/**
 * A sub-component to render the header with the page selector and save button.
 * Must be inside the Form component to access useForm().
 */
const StudioHeader = ({
  pages,
  selectedPageId,
  onPageChange,
  onAddNewPage,
  onDeletePage,
  isCreating,
  isDeleting,
  isFullscreen,
  onToggleFullscreen,
  isSidebarOpen,
  onToggleSidebar,
}: {
  pages: { id: string; title: string }[];
  selectedPageId: string | null;
  onPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddNewPage: () => void;
  onDeletePage: () => void;
  isCreating: boolean;
  isDeleting: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) => {
  const form = useForm();
  const submit = form?.submit || (() => {});
  const processing = (form as any)?.processing || false;
  const modified = (form as any)?.modified || false;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
    >
      {isFullscreen ? (
        <button
          type="button"
          className="bb-studio-fullscreen-toggle-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFullscreen();
          }}
          title="Exit Fullscreen"
        >
          <ChevronLeft size={16} />
        </button>
      ) : (
        !isSidebarOpen && (
          <button
            type="button"
            className="bb-studio-header-toggle-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSidebar();
            }}
            title="Open Menu"
          >
            <Menu size={16} />
          </button>
        )
      )}
      <select
        className="bb-page-selector"
        value={selectedPageId || "new"}
        onChange={onPageChange}
      >
        {selectedPageId === null && <option value="new">[ New Page ]</option>}
        {Array.isArray(pages) && pages.length > 0 && (
          <optgroup label="Existing Pages">
            {pages.map((page) => {
              if (!page || typeof page !== "object" || !page.id) return null;
              return (
                <option key={page.id} value={page.id}>
                  {page && typeof page === "object" && "title" in page
                    ? page.title || "Untitled"
                    : "Untitled"}
                </option>
              );
            })}
          </optgroup>
        )}
        <option value="new">+ Create New Page</option>
      </select>

      <button
        type="button"
        className="bb-add-page-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddNewPage();
        }}
        disabled={isCreating || isDeleting}
      >
        <span>+ New</span>
        <span className="bb-btn-label-text-long"> Page</span>
      </button>

      {selectedPageId && (
        <button
          type="button"
          className="bb-delete-page-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeletePage();
          }}
          disabled={isDeleting}
        >
          <span className="bb-btn-label-text-short">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
          <span className="bb-btn-label-text-long"> Page</span>
        </button>
      )}

      {!selectedPageId && (
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--bb-gold)",
            letterSpacing: "0.05em",
            background: "rgba(212, 175, 55, 0.1)",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        >
          CREATING NEW PAGE
        </div>
      )}

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          type="button"
          className="bb-studio-save-btn"
          onClick={() => submit({ skipValidation: true })}
          disabled={processing}
          style={{ opacity: processing ? 0.6 : 1 }}
        >
          {processing ? (
            selectedPageId ? (
              <>
                <span className="bb-btn-label-text-short">Saving</span>
                <span className="bb-btn-label-text-long">...</span>
              </>
            ) : (
              <>
                <span className="bb-btn-label-text-short">Creating</span>
                <span className="bb-btn-label-text-long">...</span>
              </>
            )
          ) : selectedPageId ? (
            <>
              <span>Save</span>
              <span className="bb-btn-label-text-short"> Changes</span>
            </>
          ) : (
            <>
              <span>Create</span>
              <span className="bb-btn-label-text-short"> Page</span>
            </>
          )}
        </button>

        {modified && (
          <span
            style={{
              fontSize: "10px",
              color: "var(--bb-gold)",
              opacity: 0.8,
              fontStyle: "italic",
            }}
          >
            • Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * A helper component that hooks into the Payload Form context
 * to monitor and report unsaved (modified) changes to the parent.
 */
const FormModifiedReporter = ({ onChange }: { onChange: (modified: boolean) => void }) => {
  const form = useForm();
  const modified = (form as any)?.modified || false;
  
  useEffect(() => {
    onChange(modified);
  }, [modified, onChange]);
  
  return null;
};

/**
 * A helper component that hooks into the Payload Form context
 * to monitor and report the processing/saving status to the parent.
 */
const FormProcessingReporter = ({ onChange }: { onChange: (processing: boolean) => void }) => {
  const form = useForm();
  const processing = (form as any)?.processing || false;
  
  useEffect(() => {
    onChange(processing);
  }, [processing, onChange]);
  
  return null;
};

/**
 * Helper to transform raw document data into Payload Form State.
 * This prevents the "Cannot create property 'valid' on string" error.
 */
const transformDataToFormState = (data: any) => {
  const base = data || { title: "", slug: "", layout: [] };
  const allowedFields = ["title", "slug", "layout"];

  return allowedFields.reduce((acc, key) => {
    const val =
      base[key] !== undefined ? base[key] : key === "layout" ? [] : "";
    acc[key] = {
      value: val,
      initialValue: val,
      valid: true,
      errorMessage: "",
    };
    return acc;
  }, {} as any);
};

export const PagesStudioView = () => {
  const [pages, setPages] = useState<{ id: string; title: string }[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [currentPageData, setCurrentPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Unsaved Changes Tracking State
  const [isPageDirty, setIsPageDirty] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
  const [pendingPageSwitchId, setPendingPageSwitchId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Monitor native sidebar open/collapsed class list changes
  useEffect(() => {
    const toggler = document.querySelector(".nav-toggler");
    if (!toggler) return;

    const checkState = () => {
      setIsSidebarOpen(toggler.classList.contains("nav-toggler--is-open"));
    };

    // Initial check
    checkState();

    // Configure MutationObserver
    const observer = new MutationObserver(checkState);
    observer.observe(toggler, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Fallback click listener
    toggler.addEventListener("click", checkState);

    return () => {
      observer.disconnect();
      toggler.removeEventListener("click", checkState);
    };
  }, []);

  // Window Tab Reload Block (beforeunload)
  useEffect(() => {
    if (!isPageDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPageDirty]);

  // Sidebar & External Routing Interceptor
  useEffect(() => {
    if (!isPageDirty) return;

    const handleBodyClick = (e: MouseEvent) => {
      // Do NOT intercept clicks when modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a");
      if (anchor) {
        // Do NOT intercept links with target="_blank" or the download attribute
        if (anchor.getAttribute("target") === "_blank" || anchor.hasAttribute("download")) {
          return;
        }

        const href = anchor.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          e.preventDefault();
          setPendingNavigationUrl(href);
        }
      }
    };

    document.body.addEventListener("click", handleBodyClick, true);
    return () => {
      document.body.removeEventListener("click", handleBodyClick, true);
    };
  }, [isPageDirty]);

  const handleAddNewPage = useCallback(() => {
    if (isPageDirty) {
      setPendingPageSwitchId("new");
      return;
    }
    setSelectedPageId(null);
    setCurrentPageData({
      title: "",
      slug: "",
      layout: [],
    });
  }, [isPageDirty]);

  const handleDiscardAndLeave = () => {
    setIsPageDirty(false);
    const targetUrl = pendingNavigationUrl;
    const targetPageId = pendingPageSwitchId;

    setPendingNavigationUrl(null);
    setPendingPageSwitchId(null);

    if (targetUrl) {
      window.location.href = targetUrl;
    } else if (targetPageId) {
      if (targetPageId === "new") {
        setSelectedPageId(null);
        setCurrentPageData({
          title: "",
          slug: "",
          layout: [],
        });
      } else {
        setSelectedPageId(targetPageId);
      }
    }
  };

  const handleStay = () => {
    setPendingNavigationUrl(null);
    setPendingPageSwitchId(null);
  };

  // 1. Fetch pages list for dropdown
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/pages?limit=100&select[title]=true");
        const data = await res.json();
        if (data.docs) {
          setPages(data.docs);
          // Auto-select first page if none selected, otherwise if no pages exist, trigger 'Add New'
          if (data.docs.length > 0) {
            setSelectedPageId((prev) => prev || data.docs[0].id);
          } else {
            handleAddNewPage();
          }
        }
      } catch (err) {
        console.error("Studio: Failed to fetch pages:", err);
      }
    }
    fetchPages();
  }, [handleAddNewPage]);

  // 2. Fetch full page data when selection changes
  useEffect(() => {
    if (selectedPageId) {
      async function fetchPage() {
        setLoading(true);
        try {
          const res = await fetch(`/api/pages/${selectedPageId}`);
          const data = await res.json();
          // API returns { doc: {...} } - extract the document
          const pageData = data.doc || data;
          setCurrentPageData(pageData);
        } catch (err) {
          console.error(`Studio: Failed to fetch page ${selectedPageId}:`, err);
        } finally {
          setLoading(false);
        }
      }
      fetchPage();
    }
  }, [selectedPageId]);

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVal = e.target.value;
    if (isPageDirty) {
      // Force the select value back immediately to keep it visually stable
      e.target.value = selectedPageId || "new";
      setPendingPageSwitchId(nextVal);
      return;
    }
    if (nextVal === "new") {
      handleAddNewPage();
    } else {
      setSelectedPageId(nextVal);
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPageId) return;

    const pageToDelete = pages.find((p) => p.id === selectedPageId);

    // Using a micro-delay ensures that the browser has finished processing
    // the click event before opening the blocking confirm dialog.
    // This prevents some browsers from automatically closing the dialog.
    setTimeout(async () => {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the page "${pageToDelete?.title || "Untitled"}"? This action cannot be undone.`,
      );

      if (!confirmDelete) return;

      setIsDeleting(true);
      try {
        const res = await fetch(`/api/pages/${selectedPageId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Remove from local list first
          const remainingPages = pages.filter((p) => p.id !== selectedPageId);
          setPages(remainingPages);

          // Select another page or go to new page
          if (remainingPages.length > 0) {
            setSelectedPageId(remainingPages[0].id);
          } else {
            handleAddNewPage();
          }
        } else {
          const error = await res.json();
          console.error("Studio: Failed to delete page:", error);
          alert("Failed to delete page. Please check console for details.");
        }
      } catch (err) {
        console.error("Studio: Error deleting page:", err);
        alert("An error occurred while deleting the page.");
      } finally {
        setIsDeleting(false);
      }
    }, 10);
  };

  return (
    <div
      className="pages-studio-view"
      suppressHydrationWarning
      style={{
        padding: "0",
        height: "100vh",
        overflow: "hidden",
        background: "#0A1128",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading || !currentPageData ? (
        <div
          className="bb-preview__loading"
          style={{ height: "100vh", background: "rgba(15, 27, 45, 0.5)" }}
        >
          <div className="bb-preview__spinner" />
          <span
            style={{ marginTop: "12px", color: "#8899aa", fontSize: "14px" }}
          >
            Syncing Studio...
          </span>
        </div>
      ) : (
        <Form
          key={selectedPageId || "new"}
          initialState={transformDataToFormState(currentPageData)}
          disableValidationOnSubmit={true}
          action={
            selectedPageId ? `/api/pages/${selectedPageId}` : "/api/pages"
          }
          method={selectedPageId ? "PATCH" : "POST"}
          onSuccess={(json: any) => {
            setIsPageDirty(false);

            const doc = json?.doc || json;
            if (doc && doc.id) {
              setCurrentPageData(doc);
              setSelectedPageId(doc.id);
              setPages((prev) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                if (!doc) return safePrev;

                const exists = safePrev.find((p) => p && p.id === doc.id);
                const updatedPage = {
                  id: doc.id,
                  title:
                    doc && typeof doc === "object" && "title" in doc
                      ? doc.title || "Untitled"
                      : "Untitled",
                };

                if (exists) {
                  return safePrev
                    .map((p) => (p && p.id === doc.id ? updatedPage : p))
                    .filter(Boolean) as { id: string; title: string }[];
                }
                return [...safePrev, updatedPage].filter(Boolean) as {
                  id: string;
                  title: string;
                }[];
              });
            }

            if (pendingNavigationUrl) {
              window.location.href = pendingNavigationUrl;
            } else if (pendingPageSwitchId) {
              if (pendingPageSwitchId === "new") {
                setSelectedPageId(null);
                setCurrentPageData({
                  title: "",
                  slug: "",
                  layout: [],
                });
              } else {
                setSelectedPageId(pendingPageSwitchId);
              }
              setPendingPageSwitchId(null);
            }
          }}
        >
          <FormModifiedReporter onChange={setIsPageDirty} />
          <FormProcessingReporter onChange={setIsSaving} />
          <BlocksBuilderField
            path="layout"
            label="Layout"
            id={selectedPageId}
            collectionSlug="pages"
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            customHeader={
              <StudioHeader
                pages={pages || []}
                selectedPageId={selectedPageId}
                onPageChange={handlePageChange}
                onAddNewPage={handleAddNewPage}
                onDeletePage={handleDeletePage}
                isCreating={false}
                isDeleting={isDeleting}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => {
                  const toggler = document.querySelector(".nav-toggler") as HTMLButtonElement | null;
                  if (toggler) toggler.click();
                }}
              />
            }
          />
        </Form>
      )}

      {/* Unsaved Changes Premium Modal */}
      <AnimatePresence>
        {(pendingNavigationUrl !== null || pendingPageSwitchId !== null) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isSaving ? undefined : handleStay}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(5, 10, 24, 0.88)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "520px",
                backgroundColor: "var(--bb-navy)",
                border: "1px solid var(--bb-border)",
                borderRadius: "12px",
                padding: "32px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h3
                  style={{
                    fontFamily: "Playfair Display, Georgia, serif",
                    fontSize: "24px",
                    color: "var(--bb-white)",
                    margin: 0,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Unsaved Changes
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--bb-muted)",
                    margin: 0,
                    lineHeight: "1.6",
                  }}
                >
                  You have made modifications to this page that are not saved yet.
                  Would you like to save your progress before navigating away?
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                {/* Save & Leave */}
                <motion.button
                  whileHover={isSaving ? undefined : { scale: 1.02 }}
                  whileTap={isSaving ? undefined : { scale: 0.98 }}
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    const saveBtn = document.querySelector(".bb-studio-save-btn") as HTMLButtonElement | null;
                    if (saveBtn) {
                      saveBtn.click();
                    }
                  }}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bb-gold)",
                    color: "var(--bb-navy)",
                    fontWeight: 600,
                    fontSize: "14px",
                    border: "none",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                    textAlign: "center",
                  }}
                >
                  {isSaving ? "Saving Progress..." : "Save & Leave"}
                </motion.button>

                {/* Discard & Leave */}
                <motion.button
                  whileHover={isSaving ? undefined : { scale: 1.02 }}
                  whileTap={isSaving ? undefined : { scale: 0.98 }}
                  type="button"
                  disabled={isSaving}
                  onClick={handleDiscardAndLeave}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "6px",
                    backgroundColor: "transparent",
                    color: "var(--bb-danger)",
                    border: "1px solid var(--bb-danger)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                    textAlign: "center",
                  }}
                >
                  Discard &amp; Leave
                </motion.button>

                {/* Stay on Page */}
                <motion.button
                  whileHover={isSaving ? undefined : { scale: 1.02 }}
                  whileTap={isSaving ? undefined : { scale: 0.98 }}
                  type="button"
                  disabled={isSaving}
                  onClick={handleStay}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "var(--bb-muted)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontWeight: 500,
                    fontSize: "14px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.6 : 1,
                    textAlign: "center",
                  }}
                >
                  Stay on Page
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
