// Récupérer les informations de connexion depuis le stockage local
const username = localStorage.getItem('username');
const email = localStorage.getItem('email');

const password = localStorage.getItem('password');


// Afficher le nom d'utilisateur ou l'adresse e-mail dans la page
document.getElementById('username').textContent = username || email;


var logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", function() {
  // Supprimez les informations de connexion stockées dans les cookies ou le stockage local
  // Redirigez l'utilisateur vers la page de connexion
  window.location.href = "index.html";
});

var graphbtn = document.getElementById("btn-graph");

graphbtn.addEventListener("click", function() {
  // Supprimez les informations de connexion stockées dans les cookies ou le stockage local
  // Redirigez l'utilisateur vers la page de connexion
  window.location.href = "graph.html";
});


// ----------------------------------

const url = 'https://zone01normandie.org/api/auth/signin';

// Les informations d'identification doivent être encodées en base64 avec btoa()
const info = username + ':' + password;
const credentials = btoa(info);

// Envoi de la requête POST pour obtenir un JWT
fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + credentials,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({}),
})
.then(response => response.json())
.then(data => {
  // Extraire le JWT de la réponse
  const jwt = data;

  // Vérifier la validité du JWT en extractant le payload et en le décodant
  //const payload = jwt.split('.')[1];
  //const decodepayload = atob(payload)
  //   console.log(decodepayload)

  //console.log(jwt)

//- -----------------------------------------------------------


// Send API REQUEST
// Définissez les options de la requête
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt}` // Ajouter le JWT dans l'en-tête d'autorisation
  },
  body: JSON.stringify({
    query: `
      {
        user {
          auditRatio
          attrs
          firstName
          lastName
          campus
          email
          xps {
            amount
            path
            event {
              endAt
            }
          }
        }
      }
    `
  })
};

// Définissez une variable pour stocker la réponse JSON
let dt;

// Envoyez la requête à l'API
fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', requestOptions)
  .then(response => response.json())
  .then(json => {
    dt = json;
    processData(dt)
  })
  .catch(error => console.log(error));


  function processData(data) {

    // Recup info
    var name = data.data.user[0].firstName;
    var lastName = data.data.user[0].lastName;
    var campus = data.data.user[0].campus;
    var email = data.data.user[0].email;
    var xps = data.data.user[0].xps;
    var tel = data.data.user[0].attrs.Phone;
    var addresse = data.data.user[0].attrs.addressStreet;
    var city = data.data.user[0].attrs.addressCity;

    var ratio = data.data.user[0].auditRatio;

    var lienimage = data.data.user[0].attrs.image;
    
    var image = document.createElement("img");
    image.setAttribute("src", lienimage);


    var lienimage = data.data.user[0].attrs.image;

    var image = document.createElement("img");
    image.setAttribute("src", lienimage);
    image.classList.add("responsive-img");
    image.style.border = "4px solid white";

    // Ajoute l'image à l'élément parent
    var header = document.querySelector("header");
    var user_info = header.querySelector(".banner");
    user_info.insertBefore(image, user_info.firstChild);


    // Calcul Total XP
    let total = 0;

    //console.log(xps)

    for(let i = 0; i < xps.length; i++){

      let path = xps[i].path;

      if (path.includes("div")) {
          let amount = xps[i].amount;
          let nb = parseInt(amount);
          total += nb
      }
    }
    
    total = total / 1000
    total = Math.round(total)
    //console.log(total)

    // First Graphic

    var data = [
        // ...
    ];

    for(let i = 0; i < xps.length; i++) {

      let nbm = xps[i].amount;

      let path = xps[i].path;
      let dernierSlash = path.lastIndexOf("/");

      if (dernierSlash !== -1) {
        let nouvelleChaine = path.substring(dernierSlash + 1);
        var newelem = { exercice: nouvelleChaine, points: nbm }
        
      }

      data.push(newelem)
       // console.log(path)

    }

    $(document).ready(function() {
      
        // Extraire les noms des exercices et les points dans des tableaux distincts
        var exercices = data.map(function(item) {
          return item.exercice;
        });
      
        var points = data.map(function(item) {
          return item.points;
        });
      
        // Créer le graphique avec Chart.js
        var ct = document.getElementById('myChart1').getContext('2d');
        var myChart = new Chart(ct, {
          type: 'bar',
          data: {
            labels: exercices,
            datasets: [{
              label: 'Points XP',
              data: points,
              backgroundColor: 'rgba(0, 123, 255, 0.5)'
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
      
    // End of first Graphic

    // Second Graphic

    second(data)
  
    // End of second graphic


  }

  function second(data) {

    // Données des nuages de points
    var data = [
      { x: '2023-01-01', y: 5 },
      { x: '2023-02-01', y: 10 },
      { x: '2023-03-01', y: 8 },
      { x: '2023-04-01', y: 15 },
      { x: '2023-05-01', y: 12 }
    ];

    // Conversion des dates en objets Date
    data.forEach(function(point) {
      point.x = new Date(point.x);
    });

    // Création du graphique
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Nuages de points',
          data: data,
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            },
            ticks: {
              source: 'data'
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });


  }



  //- -----------------------------------------------------------

})


.catch(error => console.error(error));


