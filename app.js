// Función para cargar el archivo CSV y convertirlo en un array de objetos
function cargarCSV(callback) {
    fetch('DB.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(',').map(header => header.trim()); // Limpiar encabezados
            console.log("Encabezados:", headers); // Ver encabezados del CSV

            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header] = row[index] ? row[index].trim() : ''; // Limpiar valores
                });
                console.log("Fila procesada:", rowData); // Ver cada fila procesada
                results.push(rowData);
            }
            callback(results);
        })
        .catch(error => {
            document.getElementById('statusMessage').innerText = 'Error al cargar el archivo CSV';
            document.getElementById('statusMessage').style.display = 'block';
            console.error('Error al cargar el archivo CSV:', error);
        });
}

// Función para buscar el CP ingresado y mostrar los resultados
function buscar() {
    const searchText = document.getElementById('searchText').value.trim();
    if (searchText === '') {
        alert('Por favor, ingrese un Código Postal.');
        return;
    }

    console.log("CP buscado:", searchText); // Ver CP que se está buscando

    // Cargar los datos del CSV y buscar el CP
    cargarCSV((data) => {
        const resultado = data.find(row => row['CP'].trim() === searchText);
        console.log("Resultado de búsqueda:", resultado); // Ver resultado de la búsqueda

        // Limpiar la tabla de resultados
        const tbody = document.querySelector('#resultTable tbody');
        tbody.innerHTML = '';

        if (resultado) {
            const row = `<tr>
                <td>${resultado['CP']}</td>
                <td>${resultado['Plaza']}</td>
                <td>${resultado['Estado']}</td>
                <td>${resultado['Municipio']}</td>
                <td>${resultado['Colonia']}</td>
                <td>${resultado['Zona']}</td>
                <td>${resultado['Caja 1 KG']}</td>
                <td>${resultado['Costo por kilo adicional']}</td>
                <td>${resultado['Palet']}</td>
            </tr>`;
            tbody.innerHTML = row;
        } else {
            alert('No se encontró el Código Postal ingresado.');
        }
    });
}
