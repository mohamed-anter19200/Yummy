let rowData = document.getElementById("rowData")               
let searchContainer = document.getElementById("searchContainer") 

function showLoadingScreen() {
     $(".loading-screen").removeClass("d-none").addClass("d-flex");
 }
 function hideLoadingScreen() {
     $(".loading-screen").fadeOut(2000, function() {
         $(this).removeClass("d-flex").addClass("d-none");
         $("body").css({ overflow: "auto" });
     });
 }
 function alertInvalidName() {
     window.alert("Invalid Name");
     $(".search-input").val("");
 }
 function alertInvalidLetter() {
     window.alert("Invalid Letter");
     $(".search-input").val("");
 }
$(".open-close-icon").on("click",function(){        
     $(".sideBar").css("left")=="0px"?closeSideBar():openSideBar();
})
 
function openSideBar(){
        $(".sideBar").animate({left : 0})
        $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
        for(let i=0;i<$(".menu").children().length;i++){
             $(".menu").children().eq(i).animate({top:0},(i + 5) * 100);
        }
}
function closeSideBar(){
       const sidebarWidth = $(".sideBar-tab").outerWidth();
       $(".sideBar").animate({left : -sidebarWidth})
       $(".open-close-icon").removeClass("fa-x").addClass("fa-align-justify");      
       for(let i=0;i<$(".menu").children().length;i++){
             $(".menu").children().eq(i).animate({top:300},(i + 5) * 100);
          }
}
async function randomMeals() {
     showLoadingScreen();
     $('.loading-screen').css("z-index",5);
     const meals = [];
     for (let i = 0; i < 15; i++) {
         const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
         const result = await response.json();        
          if (result.meals) {
             meals.push(...result.meals);
         }
     }
     if(meals != null){
          displayMeals(meals);
          hideLoadingScreen()
          $('.loading-screen').addClass('z-3');
     }
 };
 randomMeals()
function showInputs(){
     rowData.innerHTML=``
     $(".search-input").parent().css({zIndex:3})
     searchContainer.innerHTML=`
          <div class="row py-5">
               <div class="col-md-6">
                    <input oninput="searchName(this.value)" class="form-control search-input bg-transparent text-white" type="text" placeholder="Search By Name">
               </div>
               <div class="col-md-6">
                    <input oninput="searchFisrtLetter(this.value)" maxlength="1" class="form-control  search-input bg-transparent text-white" type="text" placeholder="Search By First Letter">
               </div>
          </div>
     `
}
async function searchName(name) {
     showLoadingScreen()
     $(".search-input").parent().css({zIndex:3})
     const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
     const result = await response.json();
     if (!result.meals) {
          alertInvalidName()
     } else {
             displayMeals(result.meals);
             hideLoadingScreen() 
     };
}
async function searchFisrtLetter(l){
     showLoadingScreen()
     $(".search-input").parent().css({zIndex:3})
     const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${l}`)
     const result =await data.json()     
     if (!result.meals) {
          alertInvalidLetter()
      } else {
          displayMeals(result.meals);
          hideLoadingScreen();
      }
}
function displayMeals(arr) {
     rowData.innerHTML = "";
     for (let i = 0; i < arr.length; i++) {
         rowData.innerHTML += `
             <div class="col-md-4 col-lg-3">
                 <div onclick="displayDetails(${arr[i].idMeal})" class="meal rounded-2">
                     <img src="${arr[i].strMealThumb}" class="w-100" alt="">
                     <div class="position-absolute layer text-black p-2 bg-white bg-opacity-75 d-flex align-items-center">
                         <h3>${arr[i].strMeal.split(" ").slice(0,3).join(" ")}</h3>
                     </div>
                 </div>
             </div>
         `;
     }
 }
async function displayDetails(idMeal){
     showLoadingScreen()
     $(".search-input").parent().css({zIndex:0})
     searchContainer.innerHTML=``
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
     let response = await request.json();
     const meal = response.meals[0];
     if (meal) {
          let ingredients = ``
          for(let i=1;i<=20;i++){
               if(meal[`strIngredient${i}`]!="" && meal[`strIngredient${i}`]!=null ){
                    ingredients+= ` <li class="alert alert-info p-1 me-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>  `
               }
          }
          let tag=``
          let element=``
          if(meal.strTags != null){
               let tags = meal.strTags.split(',');
               for(let i=0;i<tags.length;i++){
                    tag+=` <li class="alert alert-danger p-1 me-2">${tags[i]}</li>`
               }
               element=`
                    <h3 class="mt-0">Tags :</h3>
                    <ul class="list-unstyled d-flex g-3 flex-wrap mb-0">
                         ${tag}
                    </ul>
               `
          }
          rowData.innerHTML=`
          <div class="col-md-4">
               <div class="inner">
                    <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt="">
                    <h3>${meal.strMeal}</h3>
               </div>
          </div>
          <div class="col-md-8 ">
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                    <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                    <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                    <h3>Recipes : </h3>
                    <ul class="list-unstyled mb-0 d-flex g-3 flex-wrap">
                    ${ingredients}
                    </ul>
                    ${element}
                    <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                    <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>
     `
           hideLoadingScreen()
     }
}

async function getCategories(){
     showLoadingScreen()
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
     let response = await request.json();
     if(response.categories){
          displayCategoriesMeals(response.categories)
          hideLoadingScreen()
     }
}
function displayCategoriesMeals(arr){
     searchContainer.innerHTML=""
     rowData.innerHTML=""
     for(let i = 0;i<arr.length;i++){
          rowData.innerHTML+=`
               <div class="col-md-4 col-lg-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal rounded-2 overflow-hidden">
                    <img src="${arr[i].strCategoryThumb}" class="w-100" alt="">
                    <div class="layer text-black text-center bg-white bg-opacity-75 p-2">
                        <h3 class="mb-0">${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription}</p>
                    </div>
                </div>
               </div>
          `
     }
}
async function getCategoryMeals(category){
     showLoadingScreen()
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
     response = await request.json()
     if(response.meals){
          displayMeals(response.meals.slice(0,20))
          hideLoadingScreen()
     }
}

async function getArea(){
     showLoadingScreen()
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
     let  response = await request.json()
     if(response.meals){
          displayArea(response.meals)
          hideLoadingScreen()
     }
}
function displayArea(arr){
     searchContainer.innerHTML=""
     rowData.innerHTML=""
     for(let i = 0 ; i < arr.length ; i++){
          rowData.innerHTML+=`
               <div class="col-md-3">
                    <div onclick="getAreaMeals('${arr[i].strArea}')" class="area text-center">
                         <i class="fa-solid fa-house-laptop fa-4x"></i>
                         <h3>${arr[i].strArea}</h3>
                    </div>
               </div>
          `
     }
}
async function getAreaMeals(area){
     showLoadingScreen()
     searchContainer.innerHTML=""
     rowData.innerHTML=""
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
     let  response = await request.json()
     if(response.meals){
          displayMeals(response.meals.slice(0,20))
          hideLoadingScreen()
     }
}


async function getIngredients(){
     showLoadingScreen()
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
     let  response = await request.json()
     if(response.meals){
          displayIngredients(response.meals)
          hideLoadingScreen()
     }
}
function displayIngredients(arr){
     searchContainer.innerHTML=""
     rowData.innerHTML=""
     for(let i = 0 ; i <20; i++){
          rowData.innerHTML+=`
               <div class="col-md-3">
                    <div onclick="displayIngredientsMeals('${arr[i].strIngredient}')" class="area text-center cursor-pointer">
                         <img src="https://www.themealdb.com/images/ingredients/${arr[i].strIngredient}-Small.png"  alt="">
                         <h3>${arr[i].strIngredient}</h3>
                         <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
               </div>
          `
     }
}
async function displayIngredientsMeals(ingredientName){
     showLoadingScreen()
     let request = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`)
     let  response = await request.json()
     if(response.meals){
          displayMeals(response.meals)
          hideLoadingScreen()
     }
}
function contactUs(){
     searchContainer.innerHTML=``
     rowData.innerHTML=`
           <div class="contact  vh-100 d-flex justify-content-center align-items-center">
                <div class="container w-75 text-center"> 
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Special characters and numbers not allowed
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Email not valid *exemple@yyy.zzz
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid Phone Number
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid age
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid password *Minimum eight characters, at least one letter and one number:*
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                Enter valid repassword 
                            </div>
                        </div>
                    </div>
                    <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
               </div>
           </div>
     `
     $("#nameInput").on("focus", () => nameInputTouched = true)
     $("#emailInput").on("focus", () => emailInputTouched = true)
     $("#phoneInput").on("focus", () => phoneInputTouched = true)
     $("#ageInput").on("focus", () => ageInputTouched = true)
     $("#passwordInput").on("focus", () => passwordInputTouched = true)
     $("repasswordInput").on("focus", () => repasswordInputTouched = true)
}
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;
function inputsValidation(){
     if(nameInputTouched){
         nameValidation()? $("#nameAlert").removeClass('d-block').addClass('d-none'):$("#nameAlert").removeClass('d-none').addClass('d-block')
     }
     if(emailInputTouched){
        emailValidation()? $("#emailAlert").removeClass('d-block').addClass('d-none'):$("#emailAlert").removeClass('d-none').addClass('d-block')
     }
     if(phoneInputTouched){
        phoneValidation()? $("#phoneAlert").removeClass('d-block').addClass('d-none'):$("#phoneAlert").removeClass('d-none').addClass('d-block')
     }
     if(ageInputTouched){
        ageValidation()? $("#ageAlert").removeClass('d-block').addClass('d-none'):$("#ageAlert").removeClass('d-none').addClass('d-block')
     }
     if(passwordInputTouched){
        passwordValidation()? $("#passwordAlert").removeClass('d-block').addClass('d-none'):$("#passwordAlert").removeClass('d-none').addClass('d-block')
     }
     if(repasswordInputTouched){
        repasswordValidation()? $("#repasswordAlert").removeClass('d-block').addClass('d-none'):$("#repasswordAlert").removeClass('d-none').addClass('d-block')
     }

     if(emailValidation()&&
        nameValidation()&&
        passwordValidation()&&
        repasswordValidation()&&
        ageValidation()&&
        phoneValidation()
     ){
          $("#submitBtn").removeAttr("disabled")
     }
}
function nameValidation() {
     return (/^[a-zA-Z ]+$/.test($("#nameInput").val())) && $("#nameInput").val()!=""
}
function emailValidation() {
     return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val())) && $("#emailInput").val()!=""
}
function phoneValidation() {
     return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()))
}
function ageValidation() {
     return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()))
}
function passwordValidation() {
     return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val()))
}
function repasswordValidation() {
     return  $("#repasswordInput").val() == $("#passwordInput").val()
}