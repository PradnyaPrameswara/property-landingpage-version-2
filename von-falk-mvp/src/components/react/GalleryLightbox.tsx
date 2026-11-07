import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type GalleryPhoto = { src: string; alt: string };

export default function GalleryLightbox({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  if (!photos.length) return null;
  const selected = photos[active ?? 0];

  function navigate(direction: number) {
    setActive((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  return (
    <>
      <div className="vf-gallery-grid">
        {photos.map((photo, index) => (
        <figure key={photo.src}>
          <button
            type="button"
            className="vf-gallery-trigger"
            aria-label={`Open ${title} photo ${index + 1} of ${photos.length}`}
            onClick={() => setActive(index)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading={index < 3 ? "eager" : "lazy"}
              decoding={index < 3 ? "sync" : "async"}
              width="900"
              height="700"
            />
          </button>
        </figure>
      ))}
      </div>
      <Dialog open={active !== null} onOpenChange={(isOpen) => { if (!isOpen) setActive(null); }}>
        <DialogContent
          className="vf-lightbox-popup"
          showCloseButton={false}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
          }}
        >
          <DialogTitle className="sr-only">{title} photography</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="vf-lightbox-close"
            aria-label="Close image viewer"
            onClick={() => setActive(null)}
          >
            <X aria-hidden="true" />
          </Button>
          <img className="vf-lightbox-image" src={selected.src} alt={selected.alt} />
          <div className="vf-lightbox-toolbar">
            <Button type="button" variant="ghost" size="icon-lg" aria-label="Previous photo" onClick={() => navigate(-1)}>
              <ChevronLeft aria-hidden="true" />
            </Button>
            <span aria-live="polite">{(active ?? 0) + 1} / {photos.length}</span>
            <Button type="button" variant="ghost" size="icon-lg" aria-label="Next photo" onClick={() => navigate(1)}>
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
