document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle dark mode
  function toggleDarkMode() {
    document.body.classList.remove("bg-light");
    document.body.classList.add("bg-dark");
  }

  // Function to toggle light mode
  function toggleLightMode() {
    document.body.classList.remove("bg-dark");
    document.body.classList.add("bg-light");
  }

  // Event listener for the dropdown
  document.getElementById("darkMode").addEventListener("click", toggleDarkMode);
  document.getElementById("lightMode").addEventListener("click", toggleLightMode);

  const searchForm = document.querySelector(".navbar form");
  const searchInput = document.querySelector('.navbar input[type="search"]');
  const popularBooksContainer = document.getElementById("popularBooks");
  const bookDetailsModal = new bootstrap.Modal(document.getElementById("bookDetailsModal"));

  // Define an array of books to fetch from the Open Library API
  const booksToFetch = [
    { title: "The Hunger Games", author: "Suzanne Collins" },
    { title: "The Book Thief", author: "Markus Zusak" },
    { title: "The House of Hades", author: "Rick Riordan" },
    { title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling" },
    { title: "The Maze Runner", author: "James Dashner" },
    { title: "Me Before You", author: "Jojo Moyes" },
  ];

  // Function to fetch book details from the Open Library API
  async function fetchBookDetails(book) {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          book.title
        )}&author=${encodeURIComponent(book.author)}`
      );
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const firstResult = data.docs[0];
        return {
          title: firstResult.title,
          author: firstResult.author_name ? firstResult.author_name.join(", ") : "Unknown author",
          coverUrl: `https://covers.openlibrary.org/b/id/${firstResult.cover_i}-M.jpg`,
          description: firstResult.description
            ? firstResult.description.value
            : "No description available",
          publishDate: firstResult.publish_date ? firstResult.publish_date : "Unknown",
          edition: firstResult.edition_key ? firstResult.edition_key : "Unknown",
          numPages: firstResult.number_of_pages ? firstResult.number_of_pages : "Unknown",
          genres: firstResult.subject ? firstResult.subject.join(", ") : "Unknown",
        };
      } else {
        return null; // Book not found
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }

  // Function to render books onto the page
  async function renderBooks() {
    for (const book of booksToFetch) {
      const bookDetails = await fetchBookDetails(book);
      if (bookDetails) {
        const bookItem = `
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${bookDetails.coverUrl}" class="card-img-top" alt="${bookDetails.title}">
              <div class="card-body">
                <h5 class="card-title">${bookDetails.title}</h5>
                <p class="card-text"><strong>Author:</strong> ${bookDetails.author}</p>
                <button class="btn btn-primary view-details" 
                  data-title="${bookDetails.title}" 
                  data-author="${bookDetails.author}" 
                  data-cover="${bookDetails.coverUrl}" 
                  data-description="${bookDetails.description}" 
                  data-publish-date="${bookDetails.publishDate}" 
                  data-edition="${bookDetails.edition}" 
                  data-num-pages="${bookDetails.numPages}" 
                  data-genres="${bookDetails.genres}">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `;
        popularBooksContainer.innerHTML += bookItem;
      } else {
        // Handle case where book details are not found
        console.log(`Book '${book.title}' by ${book.author} not found.`);
      }
    }
    // Attach event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll(".view-details");
    viewDetailsButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const title = this.getAttribute("data-title");
        const author = this.getAttribute("data-author");
        const coverUrl = this.getAttribute("data-cover");
        const description = this.getAttribute("data-description");
        const publishDate = this.getAttribute("data-publish-date");
        const edition = this.getAttribute("data-edition");
        const numPages = this.getAttribute("data-num-pages");
        const genres = this.getAttribute("data-genres");

        displayBookDetails({
          title,
          author,
          coverUrl,
          description,
          publishDate,
          edition,
          numPages,
          genres,
        });
      });
    });
  }

  // Call the rendering function to fetch and display book details on page load
  renderBooks();

  // Event listener for search form submission
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      searchBooks(searchTerm);
    }
  });

  // Function to fetch books based on search term
  function searchBooks(searchTerm) {
    // Clear previous search results
    popularBooksContainer.innerHTML = "";

    // Fetch book data from Open Library API
    fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.docs && data.docs.length > 0) {
          data.docs.forEach((book) => {
            const title = book.title ? book.title : "No title available";
            const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
            const coverUrl = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "https://via.placeholder.com/150";
            const description = book.description
              ? book.description.value
              : "No description available";
            const publishDate = book.publish_date ? book.publish_date : "Unknown";
            const edition = book.edition_key ? book.edition_key : "Unknown";
            const numPages = book.number_of_pages ? book.number_of_pages : "Unknown";
            const genres = book.subject ? book.subject.join(", ") : "Unknown";

            const bookItem = `
              <div class="col-md-4 mb-4">
                <div class="card">
                  <img src="${coverUrl}" class="card-img-top" alt="${title}">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text"><strong>Author:</strong> ${author}</p>
                    <button class="btn btn-primary view-details" 
                      data-title="${title}" 
                      data-author="${author}" 
                      data-cover="${coverUrl}" 
                      data-description="${description}" 
                      data-publish-date="${publishDate}" 
                      data-edition="${edition}" 
                      data-num-pages="${numPages}" 
                      data-genres="${genres}">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            `;
            popularBooksContainer.innerHTML += bookItem;
          });

          // Add click event listener to view details button
          const viewDetailsButtons = document.querySelectorAll(".view-details");
          viewDetailsButtons.forEach((button) => {
            button.addEventListener("click", function () {
              const title = this.getAttribute("data-title");
              const author = this.getAttribute("data-author");
              const coverUrl = this.getAttribute("data-cover");
              const description = this.getAttribute("data-description");
              const publishDate = this.getAttribute("data-publish-date");
              const edition = this.getAttribute("data-edition");
              const numPages = this.getAttribute("data-num-pages");
              const genres = this.getAttribute("data-genres");

              displayBookDetails({
                title,
                author,
                coverUrl,
                description,
                publishDate,
                edition,
                numPages,
                genres,
              });
            });
          });
        } else {
          popularBooksContainer.innerHTML = "<p>No books found.</p>";
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        popularBooksContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
      });
  }

  // Function to display book details in modal
  function displayBookDetails(book) {
    const { title, author, coverUrl, description, publishDate, edition, numPages, genres } = book;
    const modalTitle = document.getElementById("bookTitle");
    const modalAuthor = document.getElementById("bookAuthor");
    const modalDetails = document.getElementById("bookDetails");
    modalTitle.textContent = title;
    modalAuthor.textContent = `Author: ${author}`;
    modalDetails.innerHTML = `
      <p><strong>Publish Date:</strong> ${publishDate}</p>
      <p><strong>Edition:</strong> ${edition}</p>
      <p><strong>Number of Pages:</strong> ${numPages}</p>
      <p><strong>Genres:</strong> ${genres}</p>
      <p>${description}</p>
    `;
    bookDetailsModal.show();
  }

  // Event listener for close button in modal
  const closeButton = document.querySelector(".modal-footer .btn.btn-secondary");
  closeButton.addEventListener("click", () => {
    bookDetailsModal.hide();
  });
});
