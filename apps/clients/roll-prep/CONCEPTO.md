# RollPrep — el concepto

> Un LMS de artes marciales construido como videojuego, no como plataforma educativa
> con puntos pegados encima.

RollPrep nace como la herramienta del gym: una clase de Jiu-Jitsu Brasileño que entrena
martes y jueves y necesitaba algo que mantuviera vivo el estudio los otros cinco días.
Pero la forma que tomó al resolverlo — HUD de jugador, rangos, ranking, modos de juego,
ceremonia de roleo — dejó de ser una app de gestión de alumnos. Es un juego cuyo tablero
es el tatami real.

Este documento explica la idea. Para instalar y correr el proyecto: [`README.md`](./README.md).

---

## 01 · La tesis

**El jiu-jitsu ya es un videojuego. Nadie lo había programado.**

Mira lo que el BJJ tiene de fábrica, sin que nadie lo diseñara para eso:

| El tatami | El videojuego |
| --- | --- |
| Cinturones y grados | Rangos y tiers |
| Grados que se ganan con tiempo en el mat | Progresión por XP |
| Sumisiones, barridas, pases | Movelist |
| Guardias, montada, espalda | Estados y posiciones |
| Torneos, brackets | Modo competitivo |
| Academias | Clanes / equipos |
| Roll | Match |

Un arte marcial con más de un siglo encima ya venía con sistema de progresión, tabla de
puntos, condiciones de victoria, roles y facciones. Lo único que faltaba era la capa
digital que lo leyera como lo que es.

La mayoría de las plataformas de aprendizaje hacen lo contrario: toman un curso y le
pegan medallitas. Aquí la gamificación **no es la envoltura, es la traducción**. Cada
número de la app corresponde a algo que pasó de verdad en el tatami.

---

## 02 · De dónde sale: el problema real

Una clase presencial de dos días a la semana tiene huecos que ningún grupo de WhatsApp
resuelve:

1. **El alumno llega frío.** Nunca vio antes la técnica que se va a estudiar. La primera
   mitad de la clase se va en entender de qué se trata.
2. **El profesor decide solo.** El currículo lo arma una persona a ojo, sin señal de qué
   le hace falta al grupo.
3. **Lo estudiado se evapora.** Lo que se vio en marzo no existe en junio. No hay archivo,
   no hay historial, no hay memoria técnica.
4. **Entre martes y jueves no pasa nada.** El vínculo con el gym se apaga y se vuelve a
   encender dos veces por semana.

RollPrep ataca los cuatro con un ciclo semanal cerrado, y ese ciclo es el *core loop*
del juego.

---

## 03 · Los pilares de diseño

Cinco reglas que gobiernan cada decisión del producto.

**1. Todo lo que hagas deja rastro numérico.**
No hay acción muerta. Estudiar la clase, votar, comentar, pelear un tope — todo suma XP,
todo mueve la barra, todo cuenta para el rango.

**2. El XP se gana afuera de la app, no adentro.**
No se recompensa el tiempo de pantalla. Se recompensa haber estudiado, haber ido a
pelear, haber opinado sobre lo que se entrena. La app es el marcador, no el juego.

**3. La progresión respeta el tatami.**
Los rangos son los cinturones reales, con sus grados reales, en el orden real. Nadie
llega a negra en un mes porque hizo clic mucho: la escala está calibrada para que la
negra tome años, como afuera.

**4. La asimetría no se corrige, se paga.**
Cuando el juego te pone en desventaja, la regla no se ablanda: sube el premio. Es la
columna vertebral del modo CAOS y de todo lo que venga después.

**5. Se ve como un fighting game, no como un dashboard.**
Anton condensado, negro profundo, volt neón, cortes diagonales, trama halftone, líneas
de velocidad. Si el alumno abre la app y no siente que entró a una pantalla de selección
de personaje, el diseño falló.

---

## 04 · El jugador

Cada alumno es un personaje con HUD: nombre, chapa de academia, cinturón con grados y
barra de XP hacia el siguiente rango.

### La escala de XP

Los puntos los otorga la base de datos vía triggers — no el cliente — así que no se
pueden inflar desde el navegador.

| Acción | XP |
| --- | --- |
| Unirte al gym | 20 |
| Completar tu perfil | 25 |
| **Estudiar la clase asignada** | **50** |
| Votar el tema de la próxima clase | 10 |
| Comentar en una clase | 5 |
| Pelear en un tope | 15 |
| 3er puesto del tope | 25 |
| Llegar a la final | 50 |
| Ganar el tope | 100 |
| *(CAOS)* Ganar desde la desventaja | 20 / 40 / 60 |
| *(CAOS)* Ganar por sumisión | 20 |

### Los 24 rangos

Cinco cinturones recorridos grado por grado, exactamente como se camina afuera:

```
Blanca → Blanca I..IV → Azul → Azul I..IV → Violeta → Violeta I..IV
       → Marrón → Marrón I..IV → Negra → Negra I..III
```

| Cinturón | Entrada | Último grado |
| --- | --- | --- |
| Blanco | 0 | 3.000 |
| Azul | 4.000 | 10.400 |
| Violeta | 12.000 | 23.200 |
| Marrón | 26.000 | 46.000 |
| Negro | 52.000 | 120.000 |

A ritmo de dos clases por semana con voto y comentario — unos **600 XP al mes** — el
camino sale más o menos así: primer grado ~1 mes · Azul ~7 meses · Violeta ~1,5 años ·
Marrón ~3,5 años · **Negra ~7 años**.

Eso es deliberado. Un rango que se sube en una semana no significa nada, y el ranking
del gym necesita respirar.

---

## 05 · El core loop semanal

El calendario del gym *es* el calendario del juego. La app cambia de modo sola según el
día, en la zona horaria configurada.

```
MARTES ──────────► JUEVES ──────────► MARTES
   │                  │                  │
   │  MODO TAREA      │  MODO VOTACIÓN   │
   │  El profe        │  Votas entre     │
   │  asigna video    │  3 temas cuál    │
   │  Lo estudias     │  se estudia      │
   │  +50 XP          │  +10 XP          │
   │                  │                  │
   └── entrenas ──────┴── entrenas ──────┘
        preparado           habiendo
                             elegido
```

Cerrado el ciclo, la clase cae en la **videoteca** y queda en el **calendario**. Nada se
pierde: el archivo técnico crece semana a semana y es consultable por fecha o por tema.

Alrededor del loop viven los **comentarios** de cada clase — dudas, variantes, lo que le
salió a cada quien — que también pagan XP y convierten la videoteca en una discusión
técnica con historial en vez de un depósito de links.

---

## 06 · Los modos de juego

Aquí es donde RollPrep deja de ser una herramienta de gestión.

La idea la robamos de Riot: **un mismo juego, varias formas de jugarlo.** Grieta del
Invocador y ARAM comparten campeones, ítems y reglas, pero se sienten distintos porque
cambia el mapa y cambian las restricciones. RollPrep hace lo mismo con el tope de clase:
mismo bracket, mismos puntos, mismo tatami — reglas distintas.

Un **tope** en RollPrep es un bracket de eliminación simple con seeds estándar, byes
repartidos automáticamente, pelea por el 3er puesto cuando hay semifinales de verdad,
resultados con método (sumisión, puntos, decisión, DQ, no presentado) y reparto de XP
por triggers. Al tope puede entrar gente sin cuenta —
**invitados**, el amigo, el de otro gym, el que vino a probar — que caen al bracket con un
nombre de guerra generado al azar ("Anaconda de Otro Gym", "Guillotina sin Kimono") para
que el profesor no tenga que preguntarle el nombre a nadie antes de sortear.

### 6.1 · Modo Clásico

> *Bracket de eliminación simple. Las reglas de siempre.*

Jiu-jitsu normal. Es la línea base y el punto de comparación.

### 6.2 · Modo CAOS

> *Cada pelea se rolea: terreno aleatorio y cartas de duelo.*

**Antes de cada pelea el profesor tira el dado, una sola vez. Lo que salga, se pelea.**

Debajo de la locura hay pedagogía real: esto es *constraints-led training* — entrenar
poniendo límites artificiales para forzar soluciones que no aparecerían en un roll
normal. Nadie practica escapar de la montada desde cuatro puntos abajo con público
mirando, hasta que la carta lo obliga.

Cada roleo saca **dos cosas**:

#### El TERRENO — la regla de arena

Aplica **igual a los dos**. Cambia el tiempo, el área, qué vale punto o qué termina la
pelea. Nunca toca la posición de arranque, así que jamás choca con el duelo.

> **Muerte Súbita** — No hay puntos. Solo la sumisión decide. Si nadie finaliza, gana quien
> haya tenido la última posición dominante.
>
> **Mundo al Revés** — Barrer vale 4, montar vale 2, pasar la guardia vale 1.
>
> **Suelo de Lava** — Nadie puede quedarse de espaldas más de cinco segundos. Al sexto,
> ventaja para el rival.
>
> **Zona de Talones** *(no-gi)* — Se abren todos los leglocks. Se para al enganchar limpio.
>
> **Guerra de Solapas** *(gi)* — Solo valen agarres de solapa y cinturón.

#### El DUELO — la carta doble

Una sola carta partida en dos mitades: **ALFA** (la ventaja) y **OMEGA** (la carga). Las
dos mitades son *la misma situación vista de cada lado*, así el arranque siempre es
coherente:

| | ALFA | OMEGA |
| --- | --- | --- |
| **Rey de la Montada** *(nivel 3)* | Arrancas montado, con cuatro puntos ya en el marcador. | Arrancas debajo de la montada, cuatro puntos abajo. Tu meta: escapar. |
| **Reloj en Contra** *(nivel 2)* | Si pasan dos minutos sin resultado, la pelea es tuya. | Tienes dos minutos para ganar. Si suenan, pierdes. |
| **Mano Muerta** *(nivel 1)* | Peleas sin restricción de agarres. | Solo un agarre a la vez. |
| **Tortugas** *(nivel 0)* | Los dos en tortuga, hombro con hombro. Nadie puede voltearse de espaldas. | *(idéntico — duelo neutro)* |

Quién agarra el lado ALFA **se sortea**: estar de primero en el bracket no te regala nada.

#### Los niveles de locura

| Nivel | Nombre | Probabilidad | Qué significa |
| --- | --- | --- | --- |
| 0 | Neutro | 25% | Los dos arrancan igual. Situación rara, cero ventaja. |
| 1 | Leve | 35% | Desbalance chiquito. |
| 2 | Serio | 25% | Se siente. |
| 3 | Brutal | 15% | El momento de grabar video. |

#### La regla de oro del balance

**La desventaja no se compensa cambiando la regla. Se compensa con el premio.**

- El **OMEGA** cobra **+10 XP por cada punto de diferencia de peso** si se lleva la pelea.
  Diferencia = 2 × nivel, o sea **20 / 40 / 60 XP** de recompensa por remontar.
- El **ALFA** solo cobra extra si **finaliza** (+20 XP). Nada de guindarse de la ventaja y
  estancar la pelea.

Los dos tienen algo que buscar. Eso es lo que hace que el CAOS sea un juego y no una
lotería.

#### Gi y No-Gi son mazos distintos

Cada carta declara para qué ruleset sirve. La mayoría funciona igual con o sin kimono;
las demás son propias de su mundo — solapa, manga y cinturón en gi; leglocks y controles
de cuerpo en no-gi — y solo entran al mazo del torneo que las puede jugar.

| Mazo | Terrenos | Duelos | Combinaciones |
| --- | --- | --- | --- |
| No-Gi | 13 | 24 | 312 |
| Gi | 13 | 23 | 299 |

Sobre 16 terrenos y 28 duelos escritos en total.

#### La ceremonia de roleo

El roleo **no es un `Math.random()` que escupe texto**. Es una secuencia a pantalla
completa, en fases, diseñada para proyectarse y para grabarse:

1. El d20 gira en el aire mientras la pantalla tiembla y pasan líneas de velocidad.
2. Impacto: flash de un frame, como el hit-stop de un combo.
3. Cae el **TERRENO** desde arriba y clava.
4. Las dos cartas de **DUELO** entran desde cada esquina y chocan en el centro.
5. Sube el **veredicto**: quién carga la desventaja y cuánto XP paga remontarla.

Se puede repetir la animación sin volver a rolear, para agarrar la toma buena. Todo es
CSS de compositor puro para que grabe limpio a 60fps, y respeta
`prefers-reduced-motion`: quien pidió menos movimiento ve el resultado sin el show.

**Este es el momento que convierte una clase en un evento.** Es contenido antes de ser
feature.

---

## 07 · El circuito: academias y ranking

Cada alumno pertenece a una **academia**, con su nombre y su color de chapa. El ranking
se puede ver completo o filtrado por academia.

Eso convierte el leaderboard de "los alumnos de mi gym ordenados por XP" en algo con
forma de circuito: varias academias, un tablero común, y topes donde se cruzan. Sumar una
academia nueva es un `insert` — no hace falta migración.

---

## 08 · Los dos roles

| | Profesor (`admin`) | Alumno (`student`) |
| --- | --- | --- |
| Publica la clase y la votación | ✅ | — |
| Crea topes, sortea el bracket, rolea el CAOS | ✅ | — |
| Carga resultados de peleas | ✅ | — |
| Gestiona usuarios, roles y academias | ✅ | — |
| Ve métricas en vivo de quién estudió y quién votó | ✅ | — |
| Estudia la clase, vota, comenta | ✅ | ✅ |
| Ve brackets, rolls, ranking y videoteca | ✅ | ✅ |

Todo se aplica con **RLS en cada tabla**, y las Server Actions revalidan el rol además de
la política. El profesor no tiene poderes por convención: los tiene por base de datos.

---

## 09 · El mapa de la app

El dashboard es una **pantalla de selección de modo**, no un menú lateral: HUD del jugador
arriba, tiles numerados abajo, con el arte del video de la clase asomándose de fondo.

| # | Pantalla | Qué es |
| --- | --- | --- |
| 01 | **La clase de hoy** | Video, notas del profesor, botón "Visto y Estudiado", hilo de comentarios |
| 02 | **Votar** | Las 3 opciones del próximo tema. El voto se puede cambiar mientras la encuesta esté abierta |
| 03 | **Calendario** | Las clases del mes, día por día |
| 04 | **Videoteca** | El archivo técnico completo |
| 05 | **Ranking** | El top del gym por XP, filtrable por academia |
| 06 | **Torneos** | Brackets clásicos y CAOS, con el manual del modo |
| 07 | **Mi perfil** | Cinturón, historial de XP evento por evento, datos y academia |

Más el panel del profesor: `/dashboard/admin`, con formularios, métricas en vivo por
Supabase Realtime y gestión de usuarios.

---

## 10 · El modelo de datos

```
profiles ──┬── academies
           ├── point_events          ← toda la economía de XP, evento por evento
           ├── assignment_completions
           ├── assignment_comments
           ├── poll_votes
           └── tournament_participants

assignments ── assignment_completions
            └─ assignment_comments

polls ── poll_options ── poll_votes

tournaments (mode: classic|caos, outfit: gi|nogi)
   ├── tournament_participants
   └── tournament_matches
          └── tournament_match_rolls   ← terreno + duelo + peso de cada lado

leaderboard    (vista) → ranking con academia
admin_users    (vista) → solo para el profesor
```

Dos decisiones que vale la pena señalar:

**El XP nunca lo escribe el cliente.** Cada punto entra por trigger de Postgres, y los
triggers son idempotentes: corregir un resultado o reabrir un torneo retira y vuelve a
repartir los puntos correctos, sin duplicados.

**La base de datos no conoce el mazo.** En `tournament_match_rolls` solo se guardan las
claves de terreno y duelo más el **peso** de cada lado (positivo = ventaja, negativo =
carga, cero = neutro). Con eso reparte el XP sin saber nada de las cartas. El mazo vive
en `libs/caos.js` y se puede reescribir entero sin tocar una sola migración.

---

## 11 · El lenguaje visual

Tema `rollprep`: negro profundo + **volt neón** (`#d4ff00`), con rojo de peligro para el
lado que carga la desventaja.

- **Anton** condensado en mayúsculas para todo titular; **Barlow** para el cuerpo.
- Números y palabras gigantes contorneadas de fondo (`OSS`, `BJJ`, `CAOS`).
- Paneles cortados en diagonal, etiquetas inclinadas tipo dorsal, trama halftone,
  rayas de hazard.
- Tiles que se despegan y proyectan sombra dura al hover, con destello diagonal.
- Barra de XP inclinada con brillo que recorre.
- Radios casi cuadrados, sin sombras suaves, sin degradados corporativos.

La referencia no es Duolingo. Es un cartel de Nike cruzado con la pantalla de selección de
un fighting game.

---

## 12 · Por qué esto no es "un LMS con puntos"

| LMS gamificado típico | RollPrep |
| --- | --- |
| Puntos por consumir contenido en la app | XP por lo que hiciste en el tatami |
| Rangos inventados (Bronce, Plata, Oro) | Los cinturones reales del arte, con sus grados |
| Un solo modo: hacer el curso | Modos de juego con reglas distintas |
| Aleatoriedad = nada, o cofres cosméticos | Aleatoriedad que **cambia cómo se pelea** |
| Competencia = tabla de horas de estudio | Competencia = bracket, con XP por remontar |
| Contenido decidido por el instructor | Currículo votado por la clase |
| Se ve como un panel de administración | Se ve como un juego de pelea |

---

## 13 · Hacia dónde va

El CAOS demostró la parte importante: **el sistema de modos aguanta**. El bracket, los
participantes y los puntos base son idénticos entre modos — lo único que cambia es la capa
de reglas encima. Eso significa que agregar un modo nuevo no es reescribir el torneo, es
escribir cartas.

### Lo siguiente en la fila: **Modo Historia**

Los topes son el multijugador. Falta la campaña.

Un camino de un solo jugador que recorre el arte **posición por posición**: capítulos que
se desbloquean al completar el anterior — La Guardia, El Pase, La Espalda — cada uno con
sus objetivos cumplidos en el tatami, su bloque de clases en la videoteca y un **jefe al
final**: un tope donde toca demostrar lo que se estudió.

Es la respuesta al hueco que queda entre el loop semanal (colectivo, marcado por el
calendario del gym) y los topes (eventos puntuales): algo que el alumno pueda perseguir a
su propio ritmo sin depender de que sea martes.

### Otras direcciones abiertas

- **Más modos competitivos.** Por equipos (academia vs. academia), rey de la colina, ligas
  por temporada con reinicio de ranking, round-robin.
- **Más mazos.** Cartas de un solo torneo, mazos temáticos, mazos que el profesor arma a
  mano para trabajar una posición específica del mes.
- **Multi-gym de verdad.** Las academias ya están en el modelo; falta que cada gym tenga
  su propio profesor, su propio currículo y su propio ranking, con un circuito por encima.
- **Temporadas.** El XP acumulado se queda (es el cinturón), pero un ranking de temporada
  que se reinicia le da a todo el mundo algo que perseguir cada pocos meses.
- **La ceremonia como contenido.** El roleo ya está hecho para grabarse. Un clip por pelea
  del tope es distribución gratis.

El norte no se mueve: **el gym primero.** RollPrep se construye para que funcione en una
clase de martes y jueves, y todo lo que se agrega tiene que sobrevivir esa prueba antes de
ser producto para alguien más.

---

*Oss.*
