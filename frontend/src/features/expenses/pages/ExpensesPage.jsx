import React from 'react'
import Card from '../components/Card'
import ExpensesTable from '../components/ExpensesTable'
import { UserSwitchIcon } from '@hugeicons/core-free-icons'

import { HugeiconsIcon } from '@hugeicons/react'
import { Wallet03Icon } from '@hugeicons/core-free-icons'
import { ChartHistogramIcon } from '@hugeicons/core-free-icons'
import { PieChart02Icon } from '@hugeicons/core-free-icons'


function ExpensesPage() {
  return (
    <div className='expenses-page'>
      <div className='expenses-header  flex flex-row items-center gap-6 mb-6'>

        <Card
        image={
          <div className="bg-green-100 p-3 rounded-2xl shadow-sm w-fit">
      <HugeiconsIcon
        icon={Wallet03Icon}
        size={24}
        color="#16a34a"
        strokeWidth={1.8}
      />
    </div>
        }
        title="Total Expenses"
        description="This month"
        amount={100.00}/>

        
        <Card
        image={
          <div className="bg-blue-100 p-3 rounded-2xl shadow-sm w-fit">
           <HugeiconsIcon
          icon={UserSwitchIcon}
          size={28}
          color="#3b82f6"
          strokeWidth={1.5}
    />
          </div>
        }
        title="This Month"
        description="from last month"
        amount={100.00}/>

        <Card
        image={
          <div className="bg-orange-100 p-3 rounded-2xl shadow-sm w-fit">
            <HugeiconsIcon
          icon={ChartHistogramIcon}
          size={28}
          color="#f59e0b"
          strokeWidth={1.5}
        />
          </div>
        }
        title="This Week"
        description="from last week"
        amount={100.00}/>

        

        <Card
        image={
          <div className="bg-purple-100 p-3 rounded-2xl shadow-sm w-fit">
         <HugeiconsIcon
          icon={PieChart02Icon}
          size={28}
          color="#8b5cf6"
          strokeWidth={1.5}
        />
          </div>
        }
        title="Today"
        description="from yesterday"
        amount={100.00}/>
        </div>

        <div className='expenses-table'>
          <ExpensesTable/>
          </div>
    </div>
  )
}

export default ExpensesPage