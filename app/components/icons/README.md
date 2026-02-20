# Icon Library

A comprehensive collection of reusable SVG icons for the FixNex application.

## Usage

### Import Individual Icons

```jsx
import { Fan, Hammer, PaintBucket } from '@/app/components/icons';

function MyComponent() {
    return (
        <div>
            <Fan width={32} height={32} />
            <Hammer className="my-custom-class" />
            <PaintBucket width={48} height={48} />
        </div>
    );
}
```

### Import Icon Library Object

```jsx
import Icons from '@/app/components/icons';

function MyComponent() {
    return (
        <div>
            <Icons.Fan />
            <Icons.Hammer />
            <Icons.PaintBucket />
        </div>
    );
}
```

### Dynamic Icon Selection

```jsx
import Icons from '@/app/components/icons';

function IconDisplay({ iconName }) {
    const IconComponent = Icons[iconName];
    
    if (!IconComponent) {
        return <div>Icon not found</div>;
    }
    
    return <IconComponent width={32} height={32} />;
}

// Usage:
<IconDisplay iconName="Fan" />
```

## Available Icons

### Service Icons
- **Fan** - AC/Fan icon
- **HeadCircuit** - Electrical/Plumbing circuit icon
- **PaintBucket** - Painting icon
- **Hammer** - Carpentry/Handyman icon
- **CardsThree** - Curtain/Blinds icon
- **GridFour** - Grid/Masonry icon
- **Wrench** - Tool/Wrench icon
- **Tools** - Tools icon

### Home & Property
- **Home** - Home icon
- **HouseLine** - House with line details
- **BuildingApartment** - Apartment/Building icon
- **Elevator** - Elevator icon
- **Bed** - Bed/Bedroom icon
- **Armchair** - Armchair/Furniture icon
- **Desk** - Desk/Office icon

### Utilities & Appliances
- **Lightbulb** - Lightbulb icon
- **Oven** - Oven/Appliance icon
- **SecurityCamera** - Security/CCTV icon
- **WaterDrop** - Water/Plumbing icon
- **Drop** - Water drop icon
- **PintGlass** - Glass/Container icon

### Nature & Outdoor
- **Plant** - Plant icon
- **PottedPlant** - Potted plant icon
- **SwimmingPool** - Pool icon
- **BugBeetle** - Bug/Pest icon
- **Wind** - Wind icon
- **Windmill** - Windmill/Energy icon

### General UI
- **ArrowRight** - Arrow pointing right
- **Shield** - Security/Protection icon
- **CheckCircle** - Check/Success icon
- **Star** - Star/Rating icon
- **Search** - Search icon
- **SquaresFour** - Grid/Layout icon
- **SpeakerNone** - Speaker icon
- **Bus** - Bus/Vehicle icon

### Communication & Business
- **Phone** - Phone icon
- **Mail** - Email icon
- **Calendar** - Calendar icon
- **CalendarDots** - Calendar with dots
- **User** - User/Profile icon
- **Settings** - Settings icon
- **Suitcase** - Suitcase/Business icon
- **DeviceMobileSpeaker** - Mobile device icon
- **Broadcast** - Broadcast/Signal icon

## Props

All icons accept the following props:

- `className` (string, optional) - Additional CSS classes
- `width` (number, optional, default: 32) - Icon width
- `height` (number, optional, default: 32) - Icon height

## Examples

### Basic Usage
```jsx
import { Fan } from '@/app/components/icons';

<Fan />
```

### With Custom Size
```jsx
import { Hammer } from '@/app/components/icons';

<Hammer width={64} height={64} />
```

### With Custom Styling
```jsx
import { PaintBucket } from '@/app/components/icons';

<PaintBucket className="text-blue-500 hover:text-blue-700" />
```

### In a Button
```jsx
import Icons from '@/app/components/icons';

<button className="flex items-center gap-2">
    <Icons.ArrowRight width={20} height={20} />
    Next
</button>
```

## Adding New Icons

To add a new icon to the library:

1. Create a new component function in `index.jsx`
2. Export it individually
3. Add it to the `IconLibrary` object
4. Update this README with the new icon name

Example:
```jsx
export const NewIcon = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* SVG content */}
    </svg>
);

// Add to IconLibrary object
const IconLibrary = {
    // ... existing icons
    NewIcon,
};
```

