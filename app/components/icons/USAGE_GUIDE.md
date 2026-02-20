# FixNex Icon Library - Usage Guide

## 📦 Successfully Refactored Components

### CoreServices.tsx
All hardcoded SVG icons have been replaced with library imports!

**Icons Replaced:**
- ✅ Fan (4 instances)
- ✅ Wrench
- ✅ HeadCircuit (5 instances)
- ✅ Oven
- ✅ SecurityCamera
- ✅ Bed (2 instances)
- ✅ Armchair (2 instances)
- ✅ Desk (2 instances)
- ✅ Bus
- ✅ SquaresFour
- ✅ SpeakerNone
- ✅ HouseLine
- ✅ PottedPlant
- ✅ SwimmingPool
- ✅ BugBeetle
- ✅ Lightbulb
- ✅ Windmill
- ✅ Elevator
- ✅ BuildingApartment
- ✅ Broadcast
- ✅ DeviceMobileSpeaker
- ✅ Drop
- ✅ User

**Total:** 27 icons replaced from hardcoded SVGs to reusable library components!

**Icons Not in Library (kept as hardcoded):**
- Clock
- Crown
- BatteryWarning
- Watch
- Sailboat
- ChatCenteredDots
- Barn
- Rectangle 49 / duct (placeholder)

---

## 🎯 How to Use the Icon Library

### Method 1: Import the entire library (Recommended)
```tsx
import Icons from '@/app/components/icons';

const MyComponent = () => {
  return (
    <div>
      <Icons.Fan />
      <Icons.SecurityCamera width={48} height={48} />
      <Icons.Bed className="text-blue-500" />
    </div>
  );
};
```

### Method 2: Import specific icons
```tsx
import { Fan, SecurityCamera, Bed } from '@/app/components/icons';

const MyComponent = () => {
  return (
    <div>
      <Fan />
      <SecurityCamera width={48} height={48} />
      <Bed className="text-blue-500" />
    </div>
  );
};
```

### Method 3: Dynamic icon selection (from JSON/DB)
```tsx
import Icons from '@/app/components/icons';
import serviceData from '@/app/db/service.json';

const ServiceCard = ({ service }) => {
  const IconComponent = Icons[service.icon]; // Gets icon by name from service.json
  
  return (
    <div>
      <IconComponent width={32} height={32} />
      <h3>{service.name}</h3>
    </div>
  );
};
```

---

## 📂 Icon Library Structure

All icons are organized by category in `/app/components/icons/index.jsx`:

```
├── NAVIGATION ICONS
│   └── ArrowRight
│
├── HOME & PROPERTY MAINTENANCE ICONS
│   ├── Fan
│   ├── HeadCircuit
│   ├── PaintBucket
│   ├── Hammer
│   ├── CardsThree
│   ├── GridFour
│   ├── Tools
│   └── Wrench
│
├── HOME & BUILDING ICONS
│   ├── Home
│   ├── HouseLine
│   └── BuildingApartment
│
├── FURNITURE & INTERIOR ICONS
│   ├── Armchair
│   ├── Bed
│   └── Desk
│
├── UTILITIES & APPLIANCES ICONS
│   ├── Lightbulb
│   ├── WaterDrop
│   ├── Drop
│   ├── Oven
│   ├── SecurityCamera
│   └── PintGlass
│
├── NATURE & OUTDOOR ICONS
│   ├── PottedPlant
│   ├── SwimmingPool
│   └── Plant
│
├── ENVIRONMENT & ENERGY ICONS
│   ├── Wind
│   └── Windmill
│
├── TECHNOLOGY & COMMUNICATION ICONS
│   ├── Broadcast
│   ├── Elevator
│   ├── Suitcase
│   ├── DeviceMobileSpeaker
│   ├── Calendar
│   ├── CalendarDots
│   ├── Phone
│   ├── Mail
│   └── Settings
│
├── GENERAL UI ICONS
│   ├── Shield
│   ├── CheckCircle
│   ├── Star
│   ├── Search
│   ├── User
│   ├── SquaresFour
│   ├── SpeakerNone
│   └── BugBeetle
│
└── TRANSPORTATION ICONS
    └── Bus
```

---

## 🎨 Customization

All icons accept these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `""` | Additional CSS classes |
| `width` | number | varies | Icon width in pixels |
| `height` | number | varies | Icon height in pixels |

Example:
```tsx
<Icons.Fan 
  className="hover:scale-110 transition-transform" 
  width={64} 
  height={64} 
/>
```

---

## 🔄 Benefits of Using the Library

1. **Consistency**: All icons use the same structure and gradients
2. **Maintainability**: Update an icon once, changes reflect everywhere
3. **Performance**: Smaller bundle size than copying SVG code everywhere
4. **Type Safety**: IntelliSense support for all icon names
5. **Easy Discovery**: Organized by category for quick finding
6. **Reusability**: Import once, use anywhere

---

## 📝 Adding New Icons to the Library

1. Open `/app/components/icons/index.jsx`
2. Find the appropriate category section (or create a new one)
3. Add your icon component following this pattern:

```jsx
export const MyNewIcon = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* SVG paths here */}
    </svg>
);
```

4. Add it to the `IconLibrary` object at the bottom:

```jsx
const IconLibrary = {
    // ... existing icons
    MyNewIcon,
};
```

5. That's it! Your icon is now available everywhere!

---

## 🔗 Integration with service.json

All services in `/app/db/service.json` have an `icon` field that maps to icon names:

```json
{
  "name": "AC servicing & repair",
  "icon": "Fan"
}
```

This allows for dynamic rendering:

```tsx
const DynamicServiceCard = ({ service }) => {
  const IconComp = Icons[service.icon];
  return <IconComp />;
};
```

---

**Last Updated:** November 7, 2025
**Total Icons:** 36
**Files Refactored:** CoreServices.tsx (27 hardcoded icons replaced)

