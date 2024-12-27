// Variables
const categories = [
    {id: 1, title: "لوسیون بدن"},
    {id: 2, title: "کرم مراقبت از پوست"},
    {id: 3, title: "ضد جوش و لکه بر"},
    {id: 4, title: "آبرسان پوست"},
    {id: 5, title: "براش"},
]
const products = [
    {id: 1, image: "product-1.png", name: "نام محصول اول", categoryName: "لوسیون بدن", price: 100000},
    {id: 2, image: "product-2.png", name: "نام محصول دوم", categoryName: "کرم مراقبت از پوست", price: 200000},
    {id: 3, image: "product-3.png", name: "نام محصول سوم", categoryName: "ضد جوش و لکه بر", price: 300000},
]
const getCategories = document.querySelector(".categories")
const getProducts = document.querySelector(".products")
const getShoppingCartHead = document.querySelector(".shopping-cart-head")
const getShoppingCartBody = document.querySelector(".shopping-cart-body")
const getShoppingCartFooter = document.querySelector(".shopping-cart-footer")

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Functions
const LoadCategories = (categories) => {
    categories.forEach((category) => {
        const createLink = document.createElement("a")
        createLink.href = "#"
        createLink.innerHTML = category.title
        createLink.setAttribute("data-id", category.id)
        getCategories.appendChild(createLink)
    })
}

const LoadProducts = (products) => {
    products.forEach((product) => {
        const createDiv = document.createElement("div")
        createDiv.classList.add("p-4", "bg-white", "rounded-[20px]")
        createDiv.setAttribute("data-id", product.id)
        createDiv.innerHTML = `
            <img src="./images/Products/${product.image}" alt="product ${product.id}" class="mx-auto rounded-[10px] object-cover">
            
            <!-- data -->
            <div class="flex flex-col mt-3.5">
                <a href="#" class="font-Peyda-Bold text-zinc-700">${product.name}</a>
                <span class="text-sm text-gray-400">${product.categoryName}</span>
            </div>

            <!-- footer -->
            <div class="flex items-center justify-between mt-4">
                <p class="text-xl text-zinc-700 font-Peyda-Bold">
                    ${product.price.toLocaleString("fa-IR")}
                    <span class="text-sm font-Peyda-Regular">تومان</span>
                </p>

                <button class="add-to-cart flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-full">
                    <svg class="w-[22px] h-[22px] text-white">
                        <use href="#shopping-cart"></use>
                    </svg>
                </button>
            </div>
        `
        getProducts.appendChild(createDiv)
    })
}

const AddToCart = (e) => {
    const button = e.target.closest(".add-to-cart");
    const productId = button.parentElement.parentElement.getAttribute("data-id");
    const product = products.find((product) => product.id === parseInt(productId));

    const existingProduct = cart.find((item) => item.id === product.id);

    existingProduct ? existingProduct.quantity += 1 : cart.push({...product, quantity: 1});

    SaveCartToLocalStorage();
    RenderCartItems();
    ShowProductsCount();
    UpdateTotalPrice();
}

const RemoveFromCart = () => {
    getShoppingCartBody.addEventListener("click", (e) => {
        const button = e.target.closest(".remove-from-cart");

        if (button) {
            const productId = button.parentElement.parentElement.getAttribute("data-id");
            const existingProduct = cart.find((item) => item.id === parseInt(productId));

            existingProduct.quantity > 1 ? existingProduct.quantity -= 1 : cart = cart.filter((item) => item.id !== parseInt(productId));

            SaveCartToLocalStorage();
            RenderCartItems();
            ShowProductsCount();
            UpdateTotalPrice();
        }
    });
}

const RenderCartItems = () => {
    getShoppingCartBody.innerHTML = "";

    cart.forEach((product) => {
        const createDiv = document.createElement("div");
        createDiv.classList.add("flex", "gap-x-2.5");
        createDiv.setAttribute("data-id", product.id);
        createDiv.innerHTML = `
            <img src="./images/Products/${product.image}" alt="product ${product.id}" class="w-20 h-20 object-cover">
        
            <div class="flex items-center justify-between grow">
                <!-- information -->
                <div class="flex flex-col justify-center gap-y-6">
                    <a href="#" class="flex items-center gap-x-2 font-Peyda-Medium">
                        ${product.name}
                        <span class="text-sm">
                            ${product.quantity === 1 ? "" : product.quantity + "عدد"}
                        </span>
                    </a>
        
                    <p class="flex items-center gap-x-0.5 text-xl text-zinc-700 font-Peyda-SemiBold">
                        ${product.price.toLocaleString("fa-IR")}
                        
                        <span class="font-Peyda-Regular text-sm">تومان</span>
                    </p>
                </div>
        
                <!-- trash icon -->
                <button class="remove-from-cart text-red-500">
                    <svg class="w-5 h-5">
                        <use href="#trash"></use>
                    </svg>
                </button>
            </div>
        `;

        getShoppingCartBody.appendChild(createDiv);
    });
}

const ShowProductsCount = () => {
    if (getShoppingCartBody.children.length === 0) {
        getShoppingCartFooter.style.display = "none"
        getShoppingCartHead.children[0].innerHTML = `خالی از سکنه`
    } else {
        getShoppingCartHead.children[0].innerHTML = `${getShoppingCartBody.children.length} مورد`
        getShoppingCartFooter.style.display = "flex"
    }
}

const UpdateTotalPrice = () => {
    const totalPrice = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    getShoppingCartFooter.children[0].children[1].children[0].innerHTML = totalPrice.toLocaleString("fa-IR")
}

const SaveCartToLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
}

const LoadCartFromLocalStorage = () => {
    if (cart.length > 0) {
        RenderCartItems();
        ShowProductsCount();
        UpdateTotalPrice();
    } else {
        ShowProductsCount();
    }
}

// EventListeners
LoadCategories(categories)
LoadProducts(products)
LoadCartFromLocalStorage();
RemoveFromCart()

const getAddToCartBtn = document.querySelectorAll(".add-to-cart")
getAddToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        AddToCart(e)
    })
})
// ${product.price.toLocaleString("fa-IR")} × ${product.quantity}
