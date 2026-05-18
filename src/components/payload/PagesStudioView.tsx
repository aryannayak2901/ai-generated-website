"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { BlocksBuilderField } from "./BlocksBuilder";
import { Form, useForm } from "@payloadcms/ui";
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
}) => {
  const form = useForm();
  const submit = form?.submit || (() => {});
  const processing = (form as any)?.processing || false;
  const modified = (form as any)?.modified || false;

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
    >
      {isFullscreen && (
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
        + New Page
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
          {isDeleting ? "Deleting..." : "Delete Page"}
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
          {processing
            ? selectedPageId
              ? "Saving..."
              : "Creating..."
            : selectedPageId
              ? "Save Changes"
              : "Create Page"}
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

  const handleAddNewPage = () => {
    setSelectedPageId(null);
    setCurrentPageData({
      title: "",
      slug: "",
      layout: [],
    });
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
            if (!selectedPageId) {
              setSelectedPageId(data.docs[0].id);
            }
          } else {
            handleAddNewPage();
          }
        }
      } catch (err) {
        console.error("Studio: Failed to fetch pages:", err);
      }
    }
    fetchPages();
  }, []);

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
    if (e.target.value === "new") {
      handleAddNewPage();
    } else {
      setSelectedPageId(e.target.value);
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
            const doc = json?.doc;
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
          }}
        >
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
              />
            }
          />
        </Form>
      )}
    </div>
  );
};
