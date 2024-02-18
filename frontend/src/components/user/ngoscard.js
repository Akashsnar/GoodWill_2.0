import React from 'react'
import './onlystyle.css'
{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> */ }


function ngoscard() {
    const openModal = async (event) => {
        var parentDiv = event.target.parentNode.parentNode.parentNode;
        var children = parentDiv.children[0];
        document.getElementById("ngoid").value = children.innerHTML.trim();
        const reviews = document.getElementById("reviews");
        document.getElementById("modal").style.display = "block";
        console.log("document ready");
        reviews.innerHTML = '';

        alert(children.innerHTML.trim());
        await fetch('/getreviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: children.innerHTML })

        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data.payload);
                console.log(data.payload.length);
                for (let i = 0; i < data.payload.length; i++) {
                    reviews.innerHTML += data.payload[i].username + ": " + data.payload[i].comment + "</br>";
                }

            })
        let getrating = document.getElementById("avgrating");
        getrating.innerHTML = '';

        await fetch('/getrating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: children.innerHTML.trim() })

        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                console.log(data.payload.length);
                let sum = 0;
                for (let i = 0; i < data.payload.length; i++) {
                    sum += data.payload[i].rating;
                }

                let avg = Math.floor(sum * 1.0 / data.payload.length);
                if (avg) {
                    getrating.innerHTML = avg + "</br>";
                    console.log("\n\nsum: " + sum);
                }
                else {
                    getrating.innerHTML = 0 + "</br>";
                    console.log("\n\nsum: " + sum);
                }
            })
    }

    const closeModal = () => {
        document.getElementById("modal").style.display = "none";
    }



    const searchrating = async () => {
        const searchResults = document.getElementById('searchResults');
        const content = document.getElementById('content').style.display = "none";
        const selected = document.querySelector('select').value;
        searchResults.innerHTML = '';
        console.log(selected);
        await fetch('/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payloadr: selected })
        }).then((res) => {

            return res.json()
        })
            .then((data) => {
                let payload = data.payloadr;

                payload.forEach(element => {

                    // alert(element.doc.username);
                    searchResults.innerHTML += `
             <div class="card">
         <div class="row ">
             <div class="col-md-7 px-3">
                 <div class="card-block px-6">
                     <h4 class="card-title"> ${element.doc.username} </h4>
                     <p class="card-text"> ${element.doc.desc} </p>
                     <br>
                     <div class="d-flex align-items-center justify-content-between mt-3 pb-3">
                         <a href="https://www.giveindia.org/" class="readmore">
                             <div class="button">Read More <span class="fas fa-arrow-right"></span></div>
                         </a>
                         <div class="d-flex align-items-center justify-content-center mt-3 pb-3">
                             <div class="button" onclick="window.location.href = '/checkout'">Donate</div>
                         </div>
                     </div>
                 </div>
             </div>
             <div class="col-md-5">
                 <div class="carousel-inner">
                     <div class="carousel-item active">
                         <img class=""
                             src="${element.doc.image}"
                             alt="Give India" style="height: 100%; width: 100%;">
                     </div>
                 </div>
             </div>
 
         </div>
     </div>

             `


                });

            });

    }


    const sendData = async (e) => {
        const searchResults = document.getElementById('searchResults');
        const content = document.getElementById('content').style.display = "none";

        searchResults.innerHTML = '';
        console.log(e.value);

        await fetch('/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: e.value })
        })
            .then((res) => {

                return res.json()
            })
            .then((data) => {
                let payload = data.payload;

                payload.forEach(element => {
                    searchResults.innerHTML += `
             <div class="card">
         <div class="row ">
             <div class="col-md-7 px-3">
                 <div class="card-block px-6">
                     <h4 class="card-title"> ${element.doc.username} </h4>
                     <p class="card-text"> ${element.doc.desc} </p>
                     <br>
                     <div class="d-flex align-items-center justify-content-between mt-3 pb-3">
                         <a href="https://www.giveindia.org/" class="readmore">
                             <div class="button">Read More <span class="fas fa-arrow-right"></span></div>
                         </a>
                         <div class="d-flex align-items-center justify-content-center mt-3 pb-3">
                             <div class="button" onclick="window.location.href = '/checkout'">Donate</div>
                         </div>
                     </div>
                 </div>
             </div>
             <div class="col-md-5">
                 <div class="carousel-inner">
                     <div class="carousel-item active">
                         <img class=""
                             src="${element.doc.image}"
                             alt="Give India" style="height: 100%; width: 100%;">
                     </div>
                 </div>
             </div>
 
         </div>
     </div>`
                });

            });
    }

    function glowStars(event) {
        const selectedStar = event.target;
        const allStars = selectedStar.parentNode.querySelectorAll("label");
        const ratingValue = selectedStar.getAttribute("for").replace("star", "");

        allStars.forEach((star) => {
            const starValue = star.getAttribute("for").replace("star", "");
            if (starValue <= ratingValue) {
                star.querySelector("i").classList.remove("fa-star-o");
                star.querySelector("i").classList.add("fa-star");
                star.querySelector("i").style.color = "#FFD700";
            }
        });
    }

    // function resetRating() {
    //     $('input[name="rating"]').prop('checked', false);
    //     $('.rating label').html('<i class="fa fa-star-o yellow-color"></i>');
    // }




    return (
        <div className='ngoscard'>

            <div class="container py-3 " style={{ paddingLeft: '15rem' }}>
                {/* <!-- Card Start --> */}

                <form action="/user" method="post" id="search">

                    <div class="inner-form">
                        <div class="input-field first-wrap">
                            <div>
                                <i class="fa-solid fa-magnifying-glass searchInputIcon"></i>
                                <input id="search" class="searchInput" type="text" name="q"
                                    placeholder='     Search NGO of your choice' onkeyup="sendData(this)" />
                                Rating:
                                <select onchange="searchrating()">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                            </div>
                        </div>

                    </div>
                </form>



                <div id="content">

                    <h1 class="servicesHeading">Ngo Connected with us:</h1>
                    {/*     
    <%for (let i=0; i<length ; i++){%>
        <br />
        <%= 1 %>

            <div class="card">
                <div class="row ">
                    <div class="col-md-7 px-3">
                        <div class="card-block px-6">
                            <% var variable=item[i].doc.username %>
                                <h4 class="card-title">
                                    <%= variable %>
                                </h4>
                                <p class="card-text" id="phead">
                                    <%= item[i].doc.desc %>
                                </p>
                                <br>
                                <div class="d-flex align-items-center justify-content-between mt-3 pb-3">
                                    <a href="https://www.giveindia.org/" class="readmore">
                                        <div class="button">Read More <span class="fas fa-arrow-right"></span></div>
                                    </a>


                                    <div class="container" style={{display: 'inline', width: '40%'}}>
                                        <button class="modal-button" onclick="openModal(event)">Give Review</button>
                                        <div id="modal" class="modal">
                                            <div class="modal-content">
                                                <span class="close" onclick="closeModal()">&times;</span>
                                                <h3>Give Review</h3>
                                                <form method="POST" action="/reviews">
                                                    <input type="text" id="ngoid" name="ngoname" value="<% variable %>">
                                                    <label for="name">Name:</label>
                                                    <input type="text" id="name" name="username"
                                                        value="<%= name %>"><br><br>
                                                    <label for="rating">Rating:</label>
                                                    <div class="rating" id="rating">
                                                        <input type="radio" id="star5" name="rating" value="5"
                                                            required />
                                                        <label for="star5"><i
                                                                class='fa fa-star-o yellow-color '></i></label>
                                                        <input type="radio" id="star4" name="rating" value="4"
                                                            required />
                                                        <label for="star4"><i class='fa fa-star-o yellow-color'></i>
                                                        </label>
                                                        <input type="radio" id="star3" name="rating" value="3"
                                                            required />
                                                        <label for="star3"><i class='fa fa-star-o yellow-color'></i>
                                                        </label>
                                                        <input type="radio" id="star2" name="rating" value="2"
                                                            required />
                                                        <label for="star2"><i class='fa fa-star-o yellow-color'></i>
                                                        </label>
                                                        <input type="radio" id="star1" name="rating" value="1"
                                                            required />
                                                        <label for="star1"><i class='fa fa-star-o yellow-color'></i>
                                                        </label>

                                                    </div>
                                                    <i class="fa fa-refresh" onclick="resetRating()"
                                                        style={{cursor: 'pointer'}}></i>

                                                    <br>
                                                    <label for="comment"></label><br>
                                                    <textarea id="comment" name="comment" rows="7" cols="30"
                                                        placeholder="Write Review" required></textarea><br><br>
                                                    <input type="submit" value="Submit">
                                                </form>
                                                <hr>
                                                <span>average review</span>
                                                <span id="avgrating">average review</span>
                                                <hr>
                                                <h2>All Reviews</h2>
                                         

                                                        <div id="reviews">
                                                            <hr/>
                                                            <hr/>
                                                           
                                                        </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div class="d-flex align-items-center justify-content-center mt-3 pb-3">
                                        <div class="button" onclick="window.location.href = '/checkout'">Donate</div>
                                    </div>
                                       
                                </div>

                    



                                
<div style={{marginLeft: '26.5rem'}}>
    <span>Report this ngo </span>
    <label class="label">
        <%if(arrofngo.includes(item[i].doc.username)){%>
            
        <input class="input" type="checkbox" onclick="changecolor(event)"> 
        
        <span id="reportbtn" ></span>
        <ion-icon class="fa"  name="thumbs-down" style={{color: 'red'}}></ion-icon>
        <% } else {%>
            <input class="input" type="checkbox"   onclick="changecolor(event)" >
        <span id="reportbtn" ></span>
        <ion-icon class="fa"  name="thumbs-down"></ion-icon>
        <%}%>
    </label>
</div>
<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
<script>
   async function changecolor(event) {
    var parentDiv = event.target.parentNode.parentNode.parentNode;
        var children = parentDiv.children[0];
        if(event.target.nextElementSibling.nextElementSibling.style.color=='red'){
            event.target.nextElementSibling.nextElementSibling.style.color='black';
           await  fetch('/reportdata', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({htmlcontent:children.innerHTML.trim(),color:'black'})

        })
        }
        else{
            event.target.nextElementSibling.nextElementSibling.style.color='red';
           await  fetch('/reportdata', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({htmlcontent:children.innerHTML.trim(),color:'red'})

        })
        }
    }
</script>











                        </div>
                    </div>
      
                    <div class="col-md-5">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img class="" src="<%= item[i].doc.image %>" alt="Give India" style={{height: '20rem', width: '30rem'}}/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <%}%> */}
                </div>
                <div id="searchResults">
                </div>

            </div>
        </div>






    )
}

export default ngoscard
