/**
 * Las cuatro unidades que enseña cada video, copiadas de
 * `apps/clients/<cliente>/data/vehiculos.json` (`catalogo.json` en dss-import):
 * primero las destacadas, luego las que tienen foto, con carrocerías
 * variadas para que la vitrina no parezca de un solo modelo.
 *
 * Los precios son los de la demo —casi todos de muestra o provisionales—, igual
 * que en la página que se le enseña al cliente. Si el inventario real llega,
 * se actualiza aquí y el video se re-renderiza.
 *
 * Solo hay foto donde la demo ya la tiene (`public/concesionarios/<id>/`); el
 * resto se pinta con la silueta de su carrocería, como en la propia web.
 */
import type { Unidad } from "./types";

export const INVENTARIO: Record<string, Unidad[]> = {
  "aprovechalo": [
    { marca: "Toyota", modelo: "RAV4", anio: 2019, precio: 32000, tipo: "suv", km: 68000, foto: "concesionarios/aprovechalo/toyota-rav4-2019.jpg" },
    { marca: "Ford", modelo: "F-150 Raptor", anio: 2021, precio: 58000, tipo: "pickup", km: 41000, foto: "concesionarios/aprovechalo/ford-f150-raptor-2021.jpg" },
    { marca: "Mercedes-Benz", modelo: "Clase C", anio: 2022, precio: 52000, tipo: "sedan", km: 31000, foto: "concesionarios/aprovechalo/mercedes-clase-c-2022.jpg" },
    { marca: "Ducati", modelo: "1199 Panigale", anio: 2016, precio: 12500, tipo: "moto", km: 18000, foto: "concesionarios/aprovechalo/ducati-panigale-2016.jpg" },
  ],
  "cittacars": [
    { marca: "Ford", modelo: "F-150 Raptor", anio: 2021, precio: 58000, tipo: "pickup", km: 41000, foto: "concesionarios/cittacars/ford-f150-raptor-2021.jpg" },
    { marca: "Hyundai", modelo: "Palisade", anio: 2023, precio: 49000, tipo: "suv", km: 29000, foto: "concesionarios/cittacars/hyundai-palisade-2023.jpg" },
    { marca: "Mercedes-Benz", modelo: "Clase C", anio: 2022, precio: 52000, tipo: "sedan", km: 31000, foto: "concesionarios/cittacars/mercedes-clase-c-2022.jpg" },
    { marca: "Lexus", modelo: "GX 460", anio: 2017, precio: 46000, tipo: "suv", km: 94000, foto: "concesionarios/cittacars/lexus-gx-460-2017.jpg" },
  ],
  "ventanacional": [
    { marca: "Toyota", modelo: "RAV4", anio: 2019, precio: 32000, tipo: "suv", km: 68000, foto: "concesionarios/ventanacional/toyota-rav4-2019.jpg" },
    { marca: "Ford", modelo: "F-150 Raptor", anio: 2021, precio: 58000, tipo: "pickup", km: 41000, foto: "concesionarios/ventanacional/ford-f150-raptor-2021.jpg" },
    { marca: "Mercedes-Benz", modelo: "Clase C", anio: 2022, precio: 52000, tipo: "sedan", km: 31000, foto: "concesionarios/ventanacional/mercedes-clase-c-2022.jpg" },
    { marca: "Ducati", modelo: "1199 Panigale", anio: 2016, precio: 12500, tipo: "moto", km: 18000, foto: "concesionarios/ventanacional/ducati-panigale-2016.jpg" },
  ],
  "hb-inversiones": [
    { marca: "Toyota", modelo: "Corolla Cross", anio: 2024, precio: 38900, tipo: "suv", km: 0, foto: "concesionarios/hb-inversiones/toyota-corolla-cross-2024.jpg" },
    { marca: "Hyundai", modelo: "Elantra", anio: 2024, precio: 32900, tipo: "sedan", km: 0, foto: "concesionarios/hb-inversiones/hyundai-elantra-2024.jpg" },
    { marca: "Volkswagen", modelo: "Tharu", anio: 2024, precio: 34900, tipo: "suv", km: 0, foto: "concesionarios/hb-inversiones/volkswagen-tharu-2024.jpg" },
    { marca: "Toyota", modelo: "Rush", anio: 2023, precio: 26500, tipo: "suv", km: 7000, foto: "concesionarios/hb-inversiones/toyota-rush-2023.jpg" },
  ],
  "dealernauta": [
    { marca: "Toyota", modelo: "Frontlander", anio: 2026, precio: 33900, tipo: "suv", km: 0 },
    { marca: "Toyota", modelo: "Corolla", anio: 2024, precio: 34500, tipo: "sedan", km: 7000 },
    { marca: "Chevrolet", modelo: "NPR", anio: 2024, precio: 58000, tipo: "camion", km: 0 },
    { marca: "GAZ", modelo: "Gazelle", anio: 2022, precio: 46000, tipo: "furgon", km: 0 },
  ],
  "veloce": [
    { marca: "Toyota", modelo: "Land Cruiser Prado", anio: 2025, precio: 89900, tipo: "suv", km: 0 },
    { marca: "Ford", modelo: "F-150", anio: 2024, precio: 79500, tipo: "pickup", km: 0 },
    { marca: "Porsche", modelo: "911", anio: 2022, precio: 168000, tipo: "sedan", km: 12600 },
    { marca: "Mercedes-Benz", modelo: "GLE 450", anio: 2024, precio: 112000, tipo: "suv", km: 0 },
  ],
  "lm2006": [
    { marca: "Toyota", modelo: "Corolla Cross", anio: 2026, precio: 43500, tipo: "suv", km: 0 },
    { marca: "Toyota", modelo: "Corolla", anio: 2026, precio: 36500, tipo: "sedan", km: 0 },
    { marca: "Sinotruk", modelo: "Howo 15T", anio: 2025, precio: 58000, tipo: "camion", km: 0 },
    { marca: "Mitsubishi", modelo: "L200", anio: 2026, precio: 38500, tipo: "pickup", km: 0 },
  ],
  "susu-cars": [
    { marca: "Toyota", modelo: "4Runner", anio: 2018, precio: 39500, tipo: "suv", km: 74000 },
    { marca: "Toyota", modelo: "Hilux", anio: 2017, precio: 32000, tipo: "pickup", km: 96000 },
    { marca: "Toyota", modelo: "Corolla", anio: 2016, precio: 15800, tipo: "sedan", km: 102000 },
    { marca: "Toyota", modelo: "Fortuner", anio: 2019, precio: 34900, tipo: "suv", km: 61000 },
  ],
  "dss-import": [
    { marca: "Chevrolet", modelo: "Optra", anio: 2011, precio: 6500, tipo: "sedan", km: 142000, cuota: 75, periodo: "semanal" },
    { marca: "Toro Power", modelo: "TP180", anio: 2026, precio: 1750, tipo: "moto", km: 0, cuota: 75, periodo: "mensual" },
    { marca: "Chevrolet", modelo: "Aveo", anio: 2006, precio: 4800, tipo: "sedan", km: 168000, cuota: 75, periodo: "semanal" },
    { marca: "Dodge", modelo: "Caliber", anio: 2007, precio: 7200, tipo: "sedan", km: 134000, cuota: 75, periodo: "semanal" },
  ],
  "kingscars": [
    { marca: "Toyota", modelo: "Corolla", anio: 2006, precio: 13900, tipo: "sedan", km: 161000 },
    { marca: "Toyota", modelo: "Fortuner", anio: 2015, precio: 29900, tipo: "suv", km: 118000 },
    { marca: "Toyota", modelo: "Hilux", anio: 2016, precio: 28500, tipo: "pickup", km: 135000 },
    { marca: "Toyota", modelo: "Corolla", anio: 2018, precio: 24500, tipo: "sedan", km: 78000 },
  ],
  "top-miami-cars": [
    { marca: "Toyota", modelo: "4Runner", anio: 2018, precio: 38500, tipo: "suv", km: 72000 },
    { marca: "Toyota", modelo: "Corolla", anio: 2019, precio: 15900, tipo: "sedan", km: 54000 },
    { marca: "Toyota", modelo: "Hilux", anio: 2019, precio: 31000, tipo: "pickup", km: 69000 },
    { marca: "Ford", modelo: "Explorer", anio: 2017, precio: 22500, tipo: "suv", km: 84000 },
  ],
  "coronadocarss": [
    { marca: "Toyota", modelo: "Yaris", anio: 2008, precio: 6500, tipo: "sedan", km: 188000 },
    { marca: "Toyota", modelo: "Fortuner", anio: 2015, precio: 29900, tipo: "suv", km: 118000 },
    { marca: "Toyota", modelo: "Hilux", anio: 2016, precio: 28500, tipo: "pickup", km: 135000 },
    { marca: "Toyota", modelo: "Corolla", anio: 2018, precio: 24500, tipo: "sedan", km: 78000 },
  ],
  "lone-star": [
    { marca: "Toyota", modelo: "Tacoma", anio: 2026, precio: 29800, tipo: "pickup", millas: 1186, foto: "concesionarios/lone-star/tacoma-2026-lateral.jpg" },
    { marca: "Toyota", modelo: "Corolla", anio: null, precio: 16000, tipo: "sedan", foto: "concesionarios/lone-star/corolla-blanco.jpg" },
    { marca: "Toyota", modelo: "RAV4", anio: 2023, precio: 14800, tipo: "suv", millas: 28430 },
    { marca: "Toyota", modelo: "Tundra", anio: 2022, precio: 27500, tipo: "pickup", millas: 41210 },
  ],
};
