import { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodItem, foodDatabase } from '@/data/foodDatabase';

export interface FoodEntry {
  food: FoodItem;
  portionG: number;
}

export interface MealSlot {
  id: string;
  label: string;
  entries: FoodEntry[];
}

interface StepFoodLogProps {
  onAnalyze: (slots: MealSlot[]) => void;
  onBack: () => void;
  initial?: MealSlot[];
}

const defaultSlots: MealSlot[] = [
  { id: '1', label: 'Breakfast', entries: [] },
  { id: '2', label: 'Lunch', entries: [] },
  { id: '3', label: 'Dinner', entries: [] },
];

const StepFoodLog = ({ onAnalyze, onBack, initial }: StepFoodLogProps) => {
  const [slots, setSlots] = useState<MealSlot[]>(initial?.length ? initial : defaultSlots);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [portionInput, setPortionInput] = useState('100');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = searchQuery.length >= 2
    ? foodDatabase.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : [];

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchQuery('');
    setPortionInput('100');
  };

  const confirmFood = (slotId: string) => {
    if (!selectedFood) return;
    const portion = parseInt(portionInput) || 100;
    setSlots(prev => prev.map(s =>
      s.id === slotId
        ? { ...s, entries: [...s.entries, { food: selectedFood, portionG: portion }] }
        : s
    ));
    setSelectedFood(null);
    setActiveSlotId(null);
    setPortionInput('100');
  };

  const cancelAdd = () => {
    setActiveSlotId(null);
    setSearchQuery('');
    setSelectedFood(null);
    setPortionInput('100');
  };

  const removeFoodFromSlot = (slotId: string, index: number) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId
        ? { ...s, entries: s.entries.filter((_, i) => i !== index) }
        : s
    ));
  };

  const addSlot = () => {
    const id = Date.now().toString();
    setSlots(prev => [...prev, { id, label: `Snack ${prev.length - 2}`, entries: [] }]);
  };

  const removeSlot = (slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId));
  };

  const renameSlot = (slotId: string, newLabel: string) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, label: newLabel } : s));
  };

  const totalEntries = slots.reduce((s, slot) => s + slot.entries.length, 0);

  const getSlotTotals = (slot: MealSlot) => {
    const cal = slot.entries.reduce((s, e) => s + (e.food.caloriesPer100g * e.portionG) / 100, 0);
    const p = slot.entries.reduce((s, e) => s + (e.food.protein * e.portionG) / 100, 0);
    const c = slot.entries.reduce((s, e) => s + (e.food.carbs * e.portionG) / 100, 0);
    const f = slot.entries.reduce((s, e) => s + (e.food.fat * e.portionG) / 100, 0);
    return { cal: Math.round(cal), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">Log Your Food</h2>
        <p className="text-muted-foreground text-sm mt-1">Add what you eat in each meal to analyze your nutrition.</p>
      </div>

      <div className="space-y-4">
        {slots.map(slot => {
          const totals = getSlotTotals(slot);
          return (
            <div key={slot.id} className="rounded-xl border border-border p-4 space-y-3">
              {/* Slot header */}
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={slot.label}
                  onChange={e => renameSlot(slot.id, e.target.value)}
                  className="font-medium text-foreground bg-transparent border-none outline-none text-sm w-32"
                />
                <div className="flex items-center gap-3">
                  {slot.entries.length > 0 && (
                    <span className="text-xs text-muted-foreground">{totals.cal} kcal</span>
                  )}
                  {slots.length > 1 && (
                    <button onClick={() => removeSlot(slot.id)} className="text-xs text-destructive hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Entries */}
              {slot.entries.length > 0 && (
                <div className="space-y-1.5">
                  {slot.entries.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground">{entry.food.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{entry.portionG}g</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {Math.round((entry.food.caloriesPer100g * entry.portionG) / 100)} kcal
                        </span>
                        <button
                          onClick={() => removeFoodFromSlot(slot.id, i)}
                          className="text-muted-foreground hover:text-destructive text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add food search */}
              {activeSlotId === slot.id ? (
                <div className="space-y-2">
                  {selectedFood ? (
                    /* Step 2: Enter quantity for selected food */
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{selectedFood.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedFood.caloriesPer100g} kcal/100g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-muted-foreground">Quantity:</label>
                        <input
                          type="number"
                          value={portionInput}
                          onChange={e => setPortionInput(e.target.value)}
                          autoFocus
                          className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                          placeholder="grams"
                        />
                        <span className="text-xs text-muted-foreground">g</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmFood(slot.id)}
                          className="flex-1 rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:opacity-90 transition"
                        >
                          Add ✓
                        </button>
                        <button
                          onClick={cancelAdd}
                          className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Step 1: Search for food */
                    <>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search food (e.g. paneer, oats)..."
                        autoFocus
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                      {filteredFoods.length > 0 && (
                        <div className="rounded-lg border border-border bg-card max-h-48 overflow-y-auto">
                          {filteredFoods.map(food => (
                            <button
                              key={food.name}
                              onClick={() => selectFood(food)}
                              className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition flex justify-between items-center border-b border-border last:border-0"
                            >
                              <div>
                                <span className="text-sm text-foreground">{food.name}</span>
                                <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${food.region === 'indian' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'}`}>
                                  {food.region === 'indian' ? '🇮🇳' : '🌍'}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">{food.caloriesPer100g} kcal/100g</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchQuery.length >= 2 && filteredFoods.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2 text-center">No foods found</p>
                      )}
                      <button
                        onClick={cancelAdd}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveSlotId(slot.id)}
                  className="w-full rounded-lg border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition"
                >
                  + Add Food
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add slot */}
      <button
        onClick={addSlot}
        className="w-full rounded-lg border border-dashed border-primary/30 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition"
      >
        + Add Another Meal Slot
      </button>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
        >
          ← Back
        </button>
        <button
          onClick={() => onAnalyze(slots)}
          disabled={totalEntries === 0}
          className="flex-1 rounded-lg bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
        >
          Analyze 🔍
        </button>
      </div>
    </motion.div>
  );
};

export default StepFoodLog;
