import { useEffect, useState } from "react";

import SectionTitle from "../../components/SectionTitle/SectionTitle";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../services/firestore/firestoreService";

import "./Gallery.css";

/*
 * Fallback gallery
 * Firebase mein data na hone par ye images show hongi.
 */
const fallbackGalleryItems = [
  {
    id: 1,
    title: "Student Activities",
    category: "Students",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Classroom Learning",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Academic Activities",
    category: "Activities",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Learning Together",
    category: "Students",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Educational Environment",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Student Development",
    category: "Activities",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackCategories = [
  "All",
  "Students",
  "Education",
  "Activities",
];

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const galleryQuery = query(
          collection(db, "gallery"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(galleryQuery);

        const firebaseItems = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }))
          .filter(
            (item) =>
              item.imageUrl &&
              item.status !== "Inactive"
          )
          .map((item) => ({
            id: item.id,
            title:
              item.title || "APJ EDU",
            category:
              item.category || "Other",
            image:
              item.imageUrl,
            description:
              item.description || "",
          }));

        setGalleryItems(firebaseItems);
      } catch (error) {
        console.error(
          "Gallery loading error:",
          error
        );

        /*
         * Firebase error hone par fallback images
         * automatically show hongi.
         */
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  /*
   * Firebase data available ho to Firebase data.
   * Otherwise fallback data.
   */
  const displayItems =
    galleryItems.length > 0
      ? galleryItems
      : fallbackGalleryItems;

  /*
   * Firebase categories dynamically create karna.
   */
  const firebaseCategories = [
    "All",
    ...Array.from(
      new Set(
        galleryItems
          .map((item) => item.category)
          .filter(Boolean)
      )
    ),
  ];

  /*
   * Firebase empty hone par fallback categories.
   */
  const categories =
    galleryItems.length > 0
      ? firebaseCategories
      : fallbackCategories;

  /*
   * Active category change hone par
   * agar selected category available nahi hai
   * to All select karna.
   */
  useEffect(() => {
    if (
      !categories.includes(activeCategory)
    ) {
      setActiveCategory("All");
    }
  }, [galleryItems, activeCategory, categories]);

  const filteredItems =
    activeCategory === "All"
      ? displayItems
      : displayItems.filter(
          (item) =>
            item.category === activeCategory
        );

  return (
    <div className="gallery-page">

      {/* Hero */}
      <section className="gallery-hero">
        <div className="gallery-container">

          <span className="gallery-hero-badge">
            APJ EDU
          </span>

          <h1>Gallery</h1>

          <p>
            Explore moments, activities and learning
            experiences from the APJ EDU community.
          </p>

        </div>
      </section>

      {/* Gallery */}
      <section className="gallery-section">
        <div className="gallery-container">

          <SectionTitle
            eyebrow="Our Moments"
            title="Life at APJ EDU"
            description="A glimpse into student activities, learning experiences and educational moments."
          />

          {/* Filters */}
          <div className="gallery-filters">

            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "gallery-filter active"
                    : "gallery-filter"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "30px 20px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Loading gallery...
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && (
            <div className="gallery-grid">

              {filteredItems.map((item) => (
                <div
                  className="gallery-card"
                  key={item.id}
                >

                  <div className="gallery-image-wrapper">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />

                    <div className="gallery-overlay">
                      <span>
                        View
                      </span>
                    </div>

                  </div>

                  <div className="gallery-card-content">

                    <span>
                      {item.category}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* Empty State */}
          {!loading &&
            filteredItems.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "50px 20px",
                  color: "#64748b",
                }}
              >
                No gallery items found.
              </div>
            )}

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gallery-cta">
        <div className="gallery-container">

          <div>
            <span className="gallery-cta-label">
              APJ EDU
            </span>

            <h2>
              Every Moment Builds a Memory
            </h2>

            <p>
              Discover more about our students,
              activities and educational journey.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Gallery;