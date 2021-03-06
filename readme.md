# Auto's in Nederland - Data Story

Data story about the impact of cars in cities, municipalities and provinces in the Netherlands. Using Vue.js and the D3.js to create a data story with interactive data-visualizations comparing cities, municipalities and provinces with the amount and type of parking facilities in the Netherlands.

## Concept

A interactive choropleth map showing the amount of parking facilities in each province and each municipality. When clicking on a municipality, the parking facilities of the parking area's are shown on the map. Hover over a parking facility to see information about the parking facility: price, type of parking facility. Beside the map are multiple datavisualizations showing the amount of parking places of the facility compared with the total in the municipality, the percentages of each type of parking facility in the municipality, and the relation between the amount of parking facilities and the age distribution of a municipality.

![Complete sketch of the datavisualization of parking places in the Netherlands](img/visualisation-complete.jpg)

## Dependencies

* Vue
* D3

See [**`package.json`**](package.json) for more information.

## Install

Clone the repository and navigate to the directory.

**Install dependencies:**

```bash
npm install
```

### Build, lint & develop

**Compile files and run hot-reload development server:**

```bash
npm run serve
```

**Build app for production:**

```bash
npm run build
```

**Lint files:**

```bash
npm run lint
```

## Data

To make the datavisualisaton I've used several datasets. I combined them together for a complete dataset with overlapping information of the RDW dataset and location data. The data I've gathered come from the following resources:

### RDW

The RDW is the national organization that tracks the registration of vehicles and vehicle related subjects in the Netherlands. The data I used are about organizations of parking places in the Netherlands. The datasets gathered from [RDW.nl](https://opendata.rdw.nl/) are:

* [Open Data Parkeren: GEBIED](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEBIED/adw6-9hsg)
* [Open Data Parkeren: GEBIEDSBEHEERDER](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEBIEDSBEHEERDER/2uc2-nnv3)
* [Open Data Parkeren: GEBRUIKSDOEL](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEBRUIKSDOEL/qidm-7mkf)
* [GEO Parkeer Garages](https://opendata.rdw.nl/Parkeren/GEO-Parkeer-Garages/t5pc-eb34)
* [Open Data Parkeren: GEOMETRIE GEBIED](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7)
* [Open Data Parkeren: Index Statisch en Dynamisch](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-Index-Statisch-en-Dynamisch/f6v7-gjpa)
* [Open Data Parkeren: PARKING OPEN](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-PARKING-OPEN/figd-gux7)
* [Open Data Parkeren: PARKING TOEGANG](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-PARKING-TOEGANG/edv8-qiyg)
* [Open Data Parkeren: SPECIFICATIES PARKEERGEBIED](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s)
* [Open Data Parkeren: TARIEFDEEL](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-TARIEFDEEL/534e-5vdg)
* [Open Data Parkeren: TIJDVAK](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-TIJDVAK/ixf8-gtwq)
* [Open Data Parkeren: PARKEERGEBIED](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-PARKEERGEBIED/mz4f-59fw)

### CBS

The CBS is the national organization for collecting information about the dutch society. The data I used is the area layout of the provinces and the municipalities of the Netherlands. The dataset gathered from [CBS](https://www.cbs.nl/) is:

* [CBS gebiedsindelingen](https://www.cbs.nl/nl-nl/dossier/nederland-regionaal/geografische-data/cbs-gebiedsindelingen)

### GeoNames

GeoNames is a website that stores information about geometric map details. The data I've gathered is the complete postal codes data of the Netherlands. The dataset gathered from GeoNames is:

* [GeoNames Data - countries](https://download.geonames.org/export/zip/)

## Resources

* [Getting started with Vue - MDN](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Vue_getting_started)
* [Vue.js Cheatsheet](https://devhints.io/vue)
* [New features in Vue 3 and how to use them - LogRocket](https://blog.logrocket.com/new-features-in-vue-3-and-how-to-use-them/)
* [Working with Webpack in Vue 3](https://cli.vuejs.org/guide/webpack.html#simple-configuration)

## License

[Apache-2.0 License](LICENSE)
