import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tab, Booking, Toast as ToastType, Package, ServiceConfig, Expense, Transaction, Payment, ExpenseCategory, Vendor } from './types';
import { TABS, SAMPLE_BOOKINGS, DEFAULT_PACKAGES, DEFAULT_SERVICES_CONFIG, SAMPLE_EXPENSES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_VENDORS } from './constants';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import Dashboard from './tabs/Dashboard';
import Bookings from './tabs/Bookings';
import NewBooking from './tabs/NewBooking';
import Calendar from './tabs/Calendar';
import Expenses from './tabs/Expenses';
import Analytics from './tabs/Analytics';
import ControlCenter from './tabs/ControlCenter';
import Accounts from './tabs/Accounts';
import ToastContainer from './components/ToastContainer';
import BookingDetailModal from './components/BookingDetailModal';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
    const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
    const [servicesConfig, setServicesConfig] = useState<ServiceConfig>(DEFAULT_SERVICES_CONFIG);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(DEFAULT_EXPENSE_CATEGORIES);
    const [vendors, setVendors] = useState<Vendor[]>(DEFAULT_VENDORS);
    const [allExpenses, setAllExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [currentSeason, setCurrentSeason] = useState('2025-26');
    const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
    const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
    const [bookingToPreselect, setBookingToPreselect] = useState<string | null>(null);
    const [bookingToPreselectInAccounts, setBookingToPreselectInAccounts] = useState<string | null>(null);
    const [preselectedDateForBooking, setPreselectedDateForBooking] = useState<string | null>(null);
    const [bookingFilterToPreselect, setBookingFilterToPreselect] = useState<Record<string, string> | null>(null);


    // Effect to auto-update booking expenses totals when allExpenses changes
    useEffect(() => {
        const expenseMap = allExpenses
            .filter(e => e.bookingId)
            .reduce((acc, exp) => {
                const amount = exp.type === 'Paid' ? exp.amount : -exp.amount;
                acc[exp.bookingId!] = (acc[exp.bookingId!] || 0) + amount;
                return acc;
            }, {} as Record<string, number>);

        setBookings(prevBookings => prevBookings.map(b => ({
            ...b,
            expenses: expenseMap[b.bookingId] || 0
        })));
    }, [allExpenses]);

    const allTransactions = useMemo((): Transaction[] => {
        const paymentTransactions: Transaction[] = bookings.flatMap(b =>
            b.payments.map(p => {
                let description = p.type === 'Received' 
                    ? `Payment from ${b.clientName}` 
                    : `Payment Reverted to ${b.clientName}`;
                
                if (p.type === 'Reverted' && p.notes) {
                    description += ` (Reason: ${p.notes})`;
                }

                return {
                    date: p.date,
                    description,
                    bookingId: b.bookingId,
                    type: p.type === 'Received' ? 'Income' : 'Expense',
                    amount: p.amount,
                    paymentMethod: p.method,
                };
            })
        );
        
        const expenseTransactions: Transaction[] = allExpenses.map(e => {
            let description = `${e.category}: ${e.vendor}`;
            if (e.type === 'Reverted' && e.notes) {
                description += ` (Revert Reason: ${e.notes})`;
            }
            return {
                date: e.expenseDate,
                description,
                bookingId: e.bookingId,
                type: e.type === 'Paid' ? 'Expense' : 'Income',
                amount: e.amount,
                paymentMethod: e.paymentMethod,
                vendor: e.vendor,
                category: e.category,
            }
        });
    
        return [...paymentTransactions, ...expenseTransactions]
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [bookings, allExpenses]);

    const availableSeasons = useMemo(() => {
        const seasons = new Set(bookings.map(b => b.season));
        seasons.add('2024-25');
        seasons.add('2025-26');
        seasons.add('2026-27');
        return Array.from(seasons).sort();
    }, [bookings]);


    const addToast = useCallback((message: string, type: ToastType['type']) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);
    
    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const handleAddBooking = (newBooking: Booking) => {
        setBookings(prev => [newBooking, ...prev]);
    };

    const handleUpdateBooking = (updatedBooking: Booking) => {
        setBookings(prev => prev.map(b => b.bookingId === updatedBooking.bookingId ? updatedBooking : b));
        setBookingToEdit(null); // Clear editing state after update
    };

    const handleEditBooking = (booking: Booking) => {
        setBookingToEdit(booking);
        setActiveTab('new-booking');
    };
    
    const handleClearEdit = () => {
        setBookingToEdit(null);
    }
    
    const handleViewBooking = (booking: Booking, focusPayment: boolean = false) => {
        setViewingBooking(booking);
        // We can pass a prop to the modal later to auto-focus the payment section if needed
    };
    
    const handleAddPayment = (bookingId: string, payment: Payment) => {
        setBookings(prev => prev.map(b => {
            if (b.bookingId === bookingId) {
                const updatedBooking = { ...b, payments: [...b.payments, payment] };
                // Also update the viewingBooking if it's the one being changed
                if (viewingBooking?.bookingId === bookingId) {
                    setViewingBooking(updatedBooking);
                }
                return updatedBooking;
            }
            return b;
        }));
        addToast(`Payment of ₹${payment.amount.toLocaleString('en-IN')} added successfully!`, 'success');
    };

    const handleRevertPayment = (bookingId: string, payment: Payment) => {
        setBookings(prev => prev.map(b => {
            if (b.bookingId === bookingId) {
                const updatedBooking = { ...b, payments: [...b.payments, payment] };
                if (viewingBooking?.bookingId === bookingId) {
                    setViewingBooking(updatedBooking);
                }
                return updatedBooking;
            }
            return b;
        }));
        addToast(`Payment of ₹${payment.amount.toLocaleString('en-IN')} reverted successfully.`, 'warning');
    };
    
    const handleAddExpense = (expense: Expense, newVendorCategoryId?: string) => {
        setAllExpenses(prev => [...prev, expense]);
        // Check if vendor is new
        if (!vendors.some(v => v.name.toLowerCase() === expense.vendor.toLowerCase())) {
            const newVendor: Vendor = {
                id: `v-${Date.now()}`,
                name: expense.vendor,
                categoryId: newVendorCategoryId || expenseCategories.find(c => c.name === 'Other')?.id || 'other',
            };
            setVendors(prev => [...prev, newVendor]);
            addToast(`New vendor "${expense.vendor}" added to category.`, 'info');
        }
        addToast('Expense added successfully!', 'success');
    };
    
    const handleRevertExpense = (revertedExpense: Expense) => {
        setAllExpenses(prev => [...prev, revertedExpense]);
        addToast(`Expense of ₹${revertedExpense.amount.toLocaleString('en-IN')} reverted successfully.`, 'warning');
    };

    const handleGoToExpenses = (bookingId: string) => {
        setBookingToPreselect(bookingId);
        setActiveTab('expenses');
    };

    const handleGoToAccounts = (bookingId: string) => {
        setBookingToPreselectInAccounts(bookingId);
        setActiveTab('accounts');
    };

    const handleGoToNewBookingWithDate = (date: string) => {
        setPreselectedDateForBooking(date);
        setActiveTab('new-booking');
    };
    
    const handleGoToBookingsWithFilter = (filter: Record<string, string>) => {
        setBookingFilterToPreselect(filter);
        setActiveTab('bookings');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard bookings={bookings} allExpenses={allExpenses} currentSeason={currentSeason} setActiveTab={setActiveTab} onViewBooking={handleViewBooking} />;
            case 'bookings':
                return <Bookings 
                    bookings={bookings} 
                    addToast={addToast} 
                    setBookings={setBookings} 
                    setAllExpenses={setAllExpenses}
                    onEditBooking={handleEditBooking}
                    onViewBooking={handleViewBooking}
                    servicesConfig={servicesConfig}
                    onGoToExpenses={handleGoToExpenses}
                    onGoToAccounts={handleGoToAccounts}
                    bookingFilterToPreselect={bookingFilterToPreselect}
                    onClearBookingFilter={() => setBookingFilterToPreselect(null)}
                />;
            case 'new-booking':
                return <NewBooking 
                    packages={packages} 
                    servicesConfig={servicesConfig} 
                    setServicesConfig={setServicesConfig}
                    addToast={addToast} 
                    setActiveTab={setActiveTab}
                    onAddBooking={handleAddBooking}
                    onUpdateBooking={handleUpdateBooking}
                    bookingToEdit={bookingToEdit}
                    onClearEdit={handleClearEdit}
                    key={bookingToEdit?.bookingId || preselectedDateForBooking || 'new'}
                    bookings={bookings}
                    currentSeason={currentSeason}
                    preselectedDate={preselectedDateForBooking}
                    onClearPreselectedDate={() => setPreselectedDateForBooking(null)}
                />;
            case 'calendar':
                return <Calendar 
                    bookings={bookings} 
                    setActiveTab={setActiveTab} 
                    currentSeason={currentSeason}
                    availableSeasons={availableSeasons}
                    addToast={addToast}
                    onViewBooking={handleViewBooking}
                    onGoToNewBookingWithDate={handleGoToNewBookingWithDate}
                />;
            case 'expenses':
                return <Expenses 
                    bookings={bookings} 
                    allExpenses={allExpenses}
                    addToast={addToast} 
                    bookingToPreselect={bookingToPreselect}
                    onClearPreselect={() => setBookingToPreselect(null)}
                    onAddExpense={handleAddExpense}
                    onRevertExpense={handleRevertExpense}
                    expenseCategories={expenseCategories}
                    vendors={vendors}
                    onViewBooking={handleViewBooking}
                />;
            case 'analytics':
                return <Analytics 
                    bookings={bookings} 
                    allExpenses={allExpenses} 
                    addToast={addToast} 
                    setActiveTab={setActiveTab}
                    onGoToBookingsWithFilter={handleGoToBookingsWithFilter}
                />;
            case 'control-center':
                return <ControlCenter 
                    packages={packages} 
                    setPackages={setPackages} 
                    servicesConfig={servicesConfig} 
                    setServicesConfig={setServicesConfig}
                    expenseCategories={expenseCategories}
                    setExpenseCategories={setExpenseCategories}
                    vendors={vendors}
                    setVendors={setVendors}
                    addToast={addToast}
                />;
            case 'accounts':
                return <Accounts 
                    transactions={allTransactions} 
                    expenseCategories={expenseCategories}
                    vendors={vendors}
                    currentSeason={currentSeason}
                    availableSeasons={availableSeasons}
                    bookings={bookings}
                    onViewBooking={handleViewBooking}
                    bookingToPreselect={bookingToPreselectInAccounts}
                    onClearPreselect={() => setBookingToPreselectInAccounts(null)}
                />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-2 md:p-5">
            <Header bookings={bookings} currentSeason={currentSeason} setCurrentSeason={setCurrentSeason} />
            <TabNavigation tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="bg-white p-4 sm:p-8 rounded-2xl border-2 border-[#cd853f] shadow-lg min-h-[400px]">
                {renderContent()}
            </main>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {viewingBooking && (
                <BookingDetailModal
                    booking={viewingBooking}
                    isOpen={!!viewingBooking}
                    onClose={() => setViewingBooking(null)}
                    servicesConfig={servicesConfig}
                    onAddPayment={handleAddPayment}
                    onRevertPayment={handleRevertPayment}
                />
            )}
        </div>
    );
};

export default App;
