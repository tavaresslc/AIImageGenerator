// Chave de API para autenticação na plataforma de geração de imagens
const apiKey = "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";

// Número máximo de imagens a serem geradas
const maxImages = 4;
let selectedImageNumber = null;

// Função para gerar um número aleatório dentro de um intervalo
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Desabilitar o botão de geração de imagens
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Habilitar o botão de geração de imagens
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Limpar a grade de imagens
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Função assíncrona para gerar as imagens com base em um input
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Falha ao gerar imagens!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null;
}

// Event listener para o botão de geração de imagens
document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

// Função para baixar a imagem ao clicar nela
function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}