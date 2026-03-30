# 📱 Guia de Responsividade - Herculano PAP

## Visão Geral

O projeto foi completamente redesenhado com uma abordagem **mobile-first** usando:
- **CSS clamp()** para tipografia fluida
- **Media queries** para breakpoints
- **Glassmorphism** com backdrop filters
- **Flexbox & Grid** para layouts adaptativos
- **Hover effects** apenas em desktop

---

## 📊 Breakpoints Responsivos

| Dispositivo | Largura | Colunas | Gap |
|---|---|---|---|
| 📱 **Smartphone** | < 640px | 1 coluna | 12px |
| 📱 **Tablet** | 640px - 1024px | 2 colunas | 20px |
| 🖥️ **Desktop** | > 1024px | 3 colunas | 24px |

---

## 🎨 Tipografia Responsiva

### Usando `clamp()`

```tsx
fontSize: "clamp(minSize, preferredSize, maxSize)"
```

**Exemplos:**
- Títulos: `clamp(18px, 5vw, 28px)` - Cresce com a tela até 28px
- Corpo: `clamp(12px, 2vw, 16px)` - Texto legível em todas as telas
- Ícones: `clamp(32px, 10vw, 80px)` - Ícones 3D que crescem

---

## 🏗️ Componentes Responsivos

### 1. **HeroCard** (Cartão Principal)

```tsx
// Responsivo automaticamente
<HeroCard 
  weather={weather}
  selectedMunicipality={municipality}
  onReload={handleReload}
/>
```

**Características:**
- ✅ Padding responsivo: `clamp(20px, 5vw, 40px)`
- ✅ Temperatura em destaque: `clamp(48px, 15vw, 96px)`
- ✅ Ícone 3D: `clamp(80px, 20vw, 150px)`
- ✅ Grid 1x2 em desktop, 1x1 em mobile

---

### 2. **MetricCard** (Cartões de Métricas)

```tsx
// Grid responsivo com auto-fill
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12
}}>
  {metrics.map(m => <MetricCard {...m} />)}
</div>
```

**Características:**
- ✅ Glassmorphism: `backdrop-filter: blur(10px)`
- ✅ Hover effects em desktop (translateY, boxShadow)
- ✅ Tipografia fluida com `clamp()`
- ✅ Altura mínima: 120px

---

### 3. **HourlyForecastCard** (Previsão Horária)

```tsx
// Card individual responsivo
<div style={{
  flex: "0 0 clamp(70px, 12vw, 100px)",
  minHeight: "clamp(100px, 25vw, 140px)"
}}>
```

**Características:**
- ✅ Largura fluida baseada em viewport
- ✅ Altura mínima responsiva
- ✅ Ícone: `clamp(20px, 5vw, 32px)`
- ✅ Temperatura: `clamp(13px, 3vw, 18px)`

---

### 4. **DailyForecastCard** (Previsão 7 Dias)

```tsx
// Card com altura uniforme
<div style={{
  minHeight: "140px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
}}>
```

**Características:**
- ✅ Altura mínima consistente em todas as telas
- ✅ Conteúdo centralizado verticalmente
- ✅ Ícone: `clamp(24px, 6vw, 36px)`
- ✅ Tipografia escalável

---

## 📐 Layout do Location Selector

```tsx
// Mobile: Stacked
// Tablet+: Grid 1fr 1fr auto
<div style={{
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12
}}>
```

**Media Query:**
```css
@media (min-width: 640px) {
  .location-selector-grid {
    grid-template-columns: 1fr 1fr auto;
  }
}
```

---

## 🎯 Responsividade de Containers

### ResponsiveGrid

```tsx
<ResponsiveGrid 
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap={{ mobile: 12, tablet: 20, desktop: 24 }}
>
  {children}
</ResponsiveGrid>
```

**Como funciona:**
- Cria dinâmicamente classes CSS com media queries
- Suporta customização de colunas e gaps
- Utiliza `useId()` para evitar conflitos

---

### ResponsiveContainer

```tsx
<ResponsiveContainer>
  {/* Conteúdo com max-width responsivo */}
</ResponsiveContainer>
```

**Widths:**
- Mobile: 100% com padding
- Tablet: 800px
- Desktop: 1200px

---

## 💡 Padrões de Responsividade Usados

### 1. **Tipografia Fluida**
```tsx
fontSize: "clamp(minSize, preferredSize%, maxSize)"
// Exemplo: clamp(12px, 2vw, 16px)
```

### 2. **Padding Responsivo**
```tsx
padding: "clamp(12px, 3vw, 20px)"
// Ajusta entre 12px (mobile) e 20px (desktop)
```

### 3. **Gap Adaptativo**
```tsx
gap: 12 // mobile
gap: 20 // tablet (1.5x)
gap: 24 // desktop (2x)
```

### 4. **Grid Auto-fill**
```tsx
gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))"
// Preenche automaticamente respeitando minWidth
```

### 5. **Flexbox Responsive**
```tsx
flexWrap: "wrap"
// Mobile: cada item em sua linha
// Desktop: vários itens por linha
```

---

## 🎨 Efeitos Responsivos

### Hover Effects (Desktop apenas)

```tsx
onMouseEnter={(e) => {
  (e.currentTarget as HTMLDivElement).style.background = "...";
  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
  (e.currentTarget as HTMLDivElement).style.boxShadow = "...";
}}
```

**Nota:** Eventos mouse não disparam em touch, então efeitos são seguros para mobile!

### Animações Fluidas

```tsx
<style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`}</style>
```

---

## 📱 Mobile-First Strategy

### Order of Implementation:

1. **Mobile (< 640px)** - Base design
   - Single column layouts
   - Touch-friendly spacing (44px+ buttons)
   - Readable fonts without zoom

2. **Tablet (640px - 1024px)** - Enhanced
   - 2-column grids
   - Increased spacing
   - Larger icons

3. **Desktop (> 1024px)** - Full Featured
   - 3-column grids
   - Hover effects
   - Expanded typography

---

## 🔧 Como Aplicar em Novos Componentes

### Checklist:

```tsx
✅ Use clamp() para fontSize
✅ Use clamp() para padding/margin
✅ Use Grid ou Flexbox com gap adaptativo
✅ Defina minHeight/minWidth para desktop
✅ Adicione hover effects (sem afetar touch)
✅ Teste em 3 breakpoints: 375px, 768px, 1440px
```

### Template:

```tsx
export function NewCard({ data }) {
  return (
    <div
      style={{
        // Base styles
        background: "...",
        padding: "clamp(12px, 3vw, 20px)",
        borderRadius: 16,
        
        // Responsive typography
        fontSize: "clamp(14px, 2vw, 16px)",
        
        // Grid layout
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
      }}
      onMouseEnter={(e) => {
        // Hover effects only on desktop
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
    >
      {/* Content */}
    </div>
  );
}
```

---

## 🚀 Performance Considerations

1. **CSS-in-JS**: Inline styles não causam reflow desnecessário
2. **clamp()**: Evita media queries múltiplas
3. **Glassmorphism**: Backdrop blur pode impactar em devices mobile fracos
4. **Animações**: Usando `transform` e `opacity` (GPU-accelerated)

---

## 🧪 Testando Responsividade

### Chrome DevTools:
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Testar em:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1440px)

### Orientações:
- 📱 Portrait
- 🔄 Landscape

### Checklist:
- ✅ Texto legível sem zoom
- ✅ Botões touch-friendly (44x44px min)
- ✅ Nenhum overflow horizontal
- ✅ Imagens/ícones escalados corretamente
- ✅ Espaçamento apropriado

---

## 📚 Referências

- [MDN: CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

## ✅ Status Responsividade

| Componente | Mobile | Tablet | Desktop | Status |
|---|---|---|---|---|
| HeroCard | ✅ | ✅ | ✅ | 🟢 Completo |
| MetricCard | ✅ | ✅ | ✅ | 🟢 Completo |
| HourlyForecastCard | ✅ | ✅ | ✅ | 🟢 Completo |
| DailyForecastCard | ✅ | ✅ | ✅ | 🟢 Completo |
| LocationSelector | ✅ | ✅ | ✅ | 🟢 Completo |
| Header | ✅ | ✅ | ✅ | 🟢 Completo |
| Footer | ✅ | ✅ | ✅ | 🟢 Completo |

---

**Última atualização:** 2024
**Status:** 🟢 Pronto para produção
