const clientInfo = document.getElementById("client-info");
const clientError = document.getElementById("client-error");
const cardContainer = document.querySelector(".card-container");

/* Fetch Product: */
const fetchAdminProduct = async () => {
  const response = await fetch(`/admin/fetch-admin-product`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const products = await response.json();

  products?.forEach((product) => {
    addToDOM(
      product?._id,
      product?.name,
      product?.img,
      product?.price,
      product?.quantity,
      product?.description
    );
  });
};
fetchAdminProduct();

// Add Individual Product to DOM:
const addToDOM = function (id, name, imgURL, price, qty, description) {
  const product = `<div class="card">
        <!-- Product Img: -->
        <div class="card-top">
        <img src=${imgURL} />
        </div>
        <div class="card-lower">
        <!-- Edit Form: -->
        <div class="card-detail">
            <form>
            <div class="form-field">
                <label for="name" class="label"> Name: </label>
                <input
                required
                autocomplete="off"
                type="text"
                id="edit-name"
                name="name"
                placeholder="Product Name"
                value="${name}"
                class="input" />
            </div>
        
            <div class="form-field">
                <label for="description" class="label">
                Description:
                </label>
                <input
                required
                autocomplete="off"
                type="text"
                name="description"
                id="edit-description"
                value="${description}"
                placeholder="Product Description"
                class="input" />
            </div>
        
            <div class="form-field">
                <label for="price" class="label"> Price: </label>
                <input
                required
                autocomplete="off"
                type="number"
                id="edit-price"
                name="price"
                value=${price}
                placeholder="Product Price"
                class="input" />
            </div>
        
            <div class="form-field">
                <label for="quantity" class="label"> Quantity: </label>
                <input
                required
                autocomplete="off"
                type="number"
                id="edit-quantity"
                name="quantity"
                value=${qty}
                placeholder="Product Quantity"
                class="input" />
            </div>
            </form>
        </div>
        
        <!-- Edit / Delete Button: -->
        <div class="button-container">
            <button type="button" onclick="editProduct('${id}', this)">update</button>
            <button type="button" class="delete-btn" onclick="deleteProduct('${id}', this)">Delete</button>
        </div>
        </div>
    </div>
    `;

  cardContainer?.insertAdjacentHTML("beforeend", product);
};

/* Edit Product: */
const editProduct = async (id, val) => {
  const name =
    val.parentNode.parentNode.children[0].children[0].children[0].children[1]
      .value;

  const description =
    val.parentNode.parentNode.children[0].children[0].children[1].children[1]
      .value;

  const price =
    val.parentNode.parentNode.children[0].children[0].children[2].children[1]
      .value;

  const quantity =
    val.parentNode.parentNode.children[0].children[0].children[3].children[1]
      .value;

  const response = await fetch(`/admin/edit-product/${id}`, {
    method: "POST",
    body: JSON.stringify({
      quantity: quantity,
      price: price,
      name: name,
      description: description,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

/* Delete Product: */
const deleteProduct = async (id, val) => {
  const response = await fetch(`/admin/delete-product/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  /* Removing product from DOM: */
  const product = val.parentNode.parentNode.parentNode;
  response.status === 200 && cardContainer.removeChild(product);
};

/* Add Product - button */
document.getElementById("new-product-btn")?.addEventListener("click", () => {
  window.location.replace("/admin/add-product-form");
});

/* Add Product - FORM HANDLER: */
document
  .getElementById("product-form")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    /* Check for Image size (250 kb) and Type(.jpeg | .jpg | .png): */
    const file = document.getElementById("img")?.files[0];

    const size = Math.round(file?.size / 1024);
    const type = file?.name.split(".").splice(-1)[0];

    const isValid =
      size < 250 && (type === "jpeg" || type === "jpg" || type === "png");

    if (!isValid) {
      clientInfo.innerText = "Follow file upload constraints.";
      return;
    }

    /* Create Form-data: */
    const formData = new FormData();
    formData.append("name", document.getElementById("name")?.value);
    formData.append("price", document.getElementById("price")?.value);
    formData.append("file", document.getElementById("img")?.files[0]);
    formData.append("quantity", document.getElementById("quantity")?.value);
    formData.append(
      "description",
      document.getElementById("description")?.value
    );

    /* Add Product to DB: */
    const response = await fetch(`/admin/add-product`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(response.status);

    clientError.innerText =
      response.status === 403
        ? "Not Authorized to add product!"
        : response.status === 500
        ? "Error! Cannot add product, please try again!"
        : "";

    clientInfo.innerText =
      response.status === 200
        ? "Product added successfully! You will be re-directed to Admin page shortly!"
        : "";

    response.status === 200 &&
      setTimeout(() => {
        window.location.replace("/admin");
      }, 4000);
  });
