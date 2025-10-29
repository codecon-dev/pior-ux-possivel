# Volume Slider Component

Um componente React de controle de volume com Tailwind CSS que oferece uma experiência de usuário precisa e intuitiva.

## Características

- **Controle Preciso**: Slider que vai de 0 a 10 com bolinha deslizante
- **Margem de Tolerância Configurável**: Defina o quão preciso o usuário deve ser
- **Reset Automático**: Se o usuário sair da área válida, o volume volta para 0
- **Responsivo**: Funciona em desktop e dispositivos móveis (touch)
- **Feedback Visual**: Indicadores visuais para posição válida/inválida
- **Acessível**: Suporte a teclado e leitores de tela

## Uso Básico

```tsx
import VolumeSlider from "@/components/VolumeSlider";

function App() {
  const handleVolumeChange = (volume: number) => {
    console.log("Volume:", volume);
  };

  return (
    <VolumeSlider
      initialVolume={5}
      onVolumeChange={handleVolumeChange}
      toleranceMargin={20}
    />
  );
}
```

## Props

| Prop              | Tipo                       | Padrão      | Descrição                             |
| ----------------- | -------------------------- | ----------- | ------------------------------------- |
| `initialVolume`   | `number`                   | `0`         | Volume inicial (0-10)                 |
| `onVolumeChange`  | `(volume: number) => void` | `undefined` | Callback chamado quando o volume muda |
| `toleranceMargin` | `number`                   | `20`        | Margem de erro em pixels              |
| `className`       | `string`                   | `''`        | Classes CSS adicionais                |

## Configuração da Margem de Tolerância

A `toleranceMargin` define a área vertical (em pixels) onde o usuário pode mover o cursor sem que o volume seja resetado:

- **5-10px**: Muito preciso, requer movimento exato sobre a linha
- **20px**: Padrão, boa usabilidade
- **30-50px**: Mais tolerante, mais fácil de usar

## Comportamento

1. **Movimento Válido**: Quando o cursor está dentro da margem de tolerância:

   - A bolinha fica azul
   - O volume é atualizado conforme a posição
   - O callback `onVolumeChange` é chamado

2. **Movimento Inválido**: Quando o cursor sai da margem de tolerância:

   - A bolinha fica vermelha
   - O volume é resetado para 0
   - Feedback visual é exibido

3. **Finalização**: Quando o usuário solta o clique/toque:
   - O estado volta ao normal
   - A posição final é mantida

## Exemplos de Uso

### Slider Básico

```tsx
<VolumeSlider initialVolume={5} onVolumeChange={(vol) => setVolume(vol)} />
```

### Slider Preciso

```tsx
<VolumeSlider toleranceMargin={10} onVolumeChange={handleVolumeChange} />
```

### Slider com Classe Customizada

```tsx
<VolumeSlider className="my-custom-slider" toleranceMargin={30} />
```

## Integração com Áudio

```tsx
function AudioPlayer() {
  const [audioVolume, setAudioVolume] = useState(5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleVolumeChange = (volume: number) => {
    setAudioVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume / 10; // Converte para 0-1
    }
  };

  return (
    <div>
      <audio ref={audioRef} src="audio.mp3" />
      <VolumeSlider
        initialVolume={audioVolume}
        onVolumeChange={handleVolumeChange}
        toleranceMargin={25}
      />
    </div>
  );
}
```

## Estilização

O componente usa Tailwind CSS e suporta modo escuro automaticamente. Você pode customizar através da prop `className` ou modificando as classes no componente.

### Cores Principais

- **Bolinha Válida**: `bg-blue-500`
- **Bolinha Inválida**: `bg-red-500`
- **Linha de Base**: `bg-gray-300`
- **Preenchimento**: `bg-blue-500`

## Desenvolvimento

Para visualizar a área de tolerância em desenvolvimento, a aplicação mostra uma linha tracejada vermelha indicando a zona válida quando `NODE_ENV === 'development'`.
