# Visualització i Anàlisi de Superfícies

Aquest projecte permet visualitzar models 3D generats a partir de diferents algorismes de reconstrucció de superfícies, com Poisson Surface Reconstruction, Marching Cubes i Marching Tetrahedra, i simplificats utilitzant mètriques d'error quàdriques (QEM).

## 🚀 Descripció del Projecte

La pàgina web permet carregar i visualitzar superfícies 3D en temps real. Els models 3D són carregats des de fitxers `.obj` i `.ply`, i es poden amb el wireframe.

Els models inclouen superfícies generades mitjançant els algorismes:

-   **Poisson Surface Reconstruction**
-   **Marching Cubes**
-   **Marching Tetrahedra**
-   **Superfícies Simplificades (Poisson, Marching Cubes, Marching Tetrahedra)**

A més, es poden comparar diversos models del conill de Stanford (`Bunny`) amb diferents quatitats de cares.

## 🛠️ Funcionalitats

### 1. **Selector de Model**

Els usuaris poden triar entre diversos models per visualitzar. Hi ha dues opcions principals:

-   **Esferes (Superfícies generades per algoritmes):**

    -   _Poisson Surface Reconstruction_
    -   _Marching Cubes_
    -   _Marching Tetrahedra_
    -   _Poisson Simplificat_
    -   _Marching Cubes Simplificat_
    -   _Marching Tetrahedra Simplificat_

-   **Conill (Bunny) amb diferents nombres de cares:**
    -   _Bunny 10.000 cares_
    -   _Bunny 5.000 cares_
    -   _Bunny 1.000 cares_
    -   _Bunny 500 cares_

### 2. **Visualització del Wireframe i Dades d'Entrada**

Els usuaris poden activar o desactivar la visualització del wireframe (estructura de línies del model) i de les dades d'entrada (els punts utilitzats per generar la superfície). Aquesta funcionalitat permet veure millor les característiques internes dels models.

### 3. **Mètriques del Model**

Les mètriques associades al model seleccionat es mostren a la part dreta de la pantalla. Aquestes mètriques inclouen estadístiques com la regularitat dels vèrtexs, les àrees dels triangles, la degeneració, el nombre de forats i l'exactitud de la malla.

## ⚙️ Tecnologies Utilitzades

-   **Three.js**: Per la visualització en 3D i la gestió de la interacció amb els models.
-   **ArcballControls**: Per permetre la rotació i moviment de la càmera en 3D.
-   **OBJLoader / PLYLoader**: Per carregar els models 3D des de fitxers `.obj` i `.ply`.
-   **React.js**: Per gestionar l'estat de la pàgina i la interacció amb l'usuari.

## 📦 Com executar el projecte

Per executar aquest projecte localment, segueix aquests passos:

1. **Clonar el repositori:**

    ```bash
    git clone https://github.com/username/repo.git
    cd repo
    ```

2. **Instal·lar les dependències:**

    ```bash
    npm install
    ```

3. **Iniciar el servidor de desenvolupament:**

    ```bash
    npm start
    ```

Aquesta acció iniciarà el servidor i obrirà la pàgina web al teu navegador localment (per defecte a `http://localhost:3000`).

## 📝 Descripció del Codi

### Components Principals:

-   **App**:  
    El component principal de la pàgina web que gestiona la càrrega dels models, l'estat de la visualització i la interacció amb l'usuari.

    -   **Càrrega de Models 3D**:  
        Els models són carregats a l'escena utilitzant les funcions `OBJLoader` i `PLYLoader`.

    -   **Selector de Models**:  
        Permet als usuaris triar entre diferents models i superfícies.

    -   **Controls d'Interacció**:  
        Utilitza `ArcballControls` per controlar la rotació i el desplaçament de la vista en 3D.

-   **Selector**:  
    Un component personalitzat que permet als usuaris seleccionar un model de la llista de models disponibles.

-   **Metrics**:  
    Mostra les mètriques del model carregat, com la regularitat dels vèrtexs i la precisió de la superfície.
