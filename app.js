//console toggle
const DEBUG=false
const INFO=false
const WARN=false
const TABLE=false
const app = Vue.createApp({
    data() {
      return {
        //array of number objects {id: int, hilight: bool}
        gridNum: [],
        //
        sequence: 0,
        //
        docs: '',
        //available colors
        colors: [
          {primary: 'orange', secondary: 'hotpink', tertiary: 'black'},
          {primary: 'dodgerblue', secondary: 'purple', tertiary: 'white'},
          {primary: 'palegreen',secondary: 'lime', tertiary: 'black'},
          {primary: 'tan', secondary: 'darkgoldenrod', tertiary: 'black'},
          {primary: 'aqua', secondary: 'teal', tertiary: 'black'},
          {primary: 'firebrick', secondary: 'gold', tertiary: 'white'},
        ],
        //color selector index
        index: '0'
      };
    },
    computed: {
      getColorClass() {
        if(DEBUG) console.log(this.index)
        switch (this.index+1) {
          case 1: return 'color1'
          break
          case 2: return 'color2'
          break
          case 3: return 'color3'
          break
          case 4: return 'color4'
          break
          case 5: return 'color5'
          break
          case 6: return 'color6'
          break
          case 7: return 'color7'
          break
          default: return 'color1'
          break
        }
      }
    },
    methods: { 
      initGrid() {
        //populate grid with loop at creation
        let grid=new Array(100)
        for(let i=1;i<=100;i++) {
          grid[i-1] = { 'id': i, 'hilite': false}
        }
        if(TABLE) console.table(grid)
        this.gridNum = grid
      },
      //prepare grid for next operation
      reset(seqPreserve=false,colorPreserve=true) { //console.warn(seqPreserve,colorPreserve)
        for(num in this.gridNum) {
          let currentNum=parseInt(num)
          this.gridNum[num].id=currentNum+1 //make sure the id isnt a string from ordinalizing      
          this.gridNum[num].hilite=false //reset hilighted items     
        }
        if(!seqPreserve) {
          this.sequence=0
        }
        if(!colorPreserve) {
          this.index='0'
        }        
        this.docs=''
        if(TABLE) console.table(this.gridNum[num].id)
      },
      //return prime numbers from 1 to num
      getPrimes: (num)=>Array(num-1).fill().map((e,i)=>2+i).filter((e,i,a)=>a.slice(0,i).every(x=>e%x!==0)),
      showPrimes() {
        //highlight prime numbers
        this.reset()
        if(DEBUG) console.debug(this.getPrimes(100))
        const primes = this.getPrimes(100)
        for(num in this.gridNum) {
          if(primes.includes(this.gridNum[num].id)) {
            this.gridNum[num].hilite=true
          } else {
            this.gridNum[num].hilite=false
          }
        }
      },
      showOrdinals() {
        //modify numbers to display ordinals
        this.reset()
        for(num in this.gridNum) {
          if([0,4,5,6,7,8,9,11,12,13].includes(this.gridNum[num].id %10)) {
            this.gridNum[num].id+='th'
          } else if(this.gridNum[num].id %10 === 1) {
            this.gridNum[num].id+='st'
          } else if(this.gridNum[num].id %10 === 2) {
           this.gridNum[num].id+='nd'
          } else if(this.gridNum[num].id %10 === 3) {
            this.gridNum[num].id+='rd'
          }
        }
      },
      showFibos(num) {
        // The next number is found by adding up the two numbers before it:
        // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
        this.reset()        
        let a = 1, b = 0, temp;
        while (num >= 0){
          temp = a;
          a = a + b;
          b = temp;
          num--;
          if(DEBUG) console.debug(b+"\n");
          this.gridNum[b-1].hilite=true
        }
      },
      showRoman() {
        // Display the number in roman format I, II, III, etc
        this.reset()        
        for(num in this.gridNum) {
          currentNum = this.gridNum[num].id
          roman=''
          if(currentNum <= 39) {
            if(currentNum.toString().length===2) {
              roman+="X".repeat(currentNum/10)
            }
          } else if(currentNum >= 40 && currentNum <= 49) {
            roman+="XL"          
          } else if(currentNum >= 50 && currentNum <= 89) {
            roman+="L"    
            roman+="X".repeat((currentNum/10)-5)      
          } else if(currentNum >= 90 && currentNum <= 99) {
            roman+="XC"    
          } else if(currentNum === 100) {
            roman+="C"
          }         
          switch(currentNum % 10) {
            case 1: roman+="I"
            break;
            case 2: roman+="II"
            break;
            case 3: roman+="III"
            break;
            case 4: roman+="IV"
            break;
            case 5: roman+="V"
            break;
            case 6: roman+="VI"
            break;
            case 7: roman+="VII"
            break;
            case 8: roman+="VIII"
            break;
            case 9: roman+="IX"
            break;
          }
          if(TABLE) console.table(currentNum+"="+roman+"\n")
          this.gridNum[num].id=roman
        }
      },
      showSequence() {
        this.reset(true) //preserve sequence          
        for(num in this.gridNum) {
          if(this.gridNum[num].id%this.sequence===0) {
            this.gridNum[num].hilite=true
          }
        }
      },  
      showSquares(){
        this.reset()
        for(num in this.gridNum) {
          let currentNumber=this.gridNum[num].id
          let sqrt=Math.sqrt(currentNumber)
          if(DEBUG) console.log(currentNumber, sqrt)
          if(sqrt%1===0) {
            this.gridNum[num].hilite=true
          }
        }          
        if(DEBUG) console.log()
      },    
      showDocs(displayed){
        if(!displayed) {
          const docs=`
          <fieldset>
            <legendDocumentation</legend>
            <p>This application is constructed with basic Vue.js without the help of a CLI.<br/> 
            Use the Operations buttons to highlight or display results in the number grid.<br/>
            <ul>
              <li>Square: Highlights perfect squares (numbers that give a whole square root).</li>
              <li>Prime: Highlights primes (numbers that have only 2 factors: 1 and themselves).</li>
              <li>Fibonacci: Highlights Fibonicci's numbers (Given the next number is found by adding up the two numbers before it).</li>
              <li>Ordinal: Displays numbers in ordinal notation (Nst, Nnd, Nrd, etc).</li>
              <li>Roman: Displays numbers in roman format (I, II, III, etc).</li>
              <li>Sequence: Select a number to highlight a range of ordered numbers linked by addition.</li>
            <ul>
          </fieldset>
          `        
          this.docs=docs
        } else {
          this.docs=''
        }
      },
      changeColors(event, selected){
        if(DEBUG) console.log("Sel="+selected) 
        this.index=selected
        if(DEBUG) console.log(this.colors[this.index].primary+'/'+this.colors[this.index].secondary)
      },
      getColorStyle(num) {
        if(!DEBUG) console.log("index: "+this.index+ ", num: "+JSON.stringify(num), num.hilite ? 'silver' : '#fff')
        if(num.hilite && this.index>0) {
          return 'background-color:'+this.colors[this.index-1].primary+';color:'+this.colors[this.index-1].tertiary
        } else if(num.hilite && this.index===0) {
          return 'background-color:silver;color:black'
        } else {
           return 'background-color:white;color:black'
        }
      } 
    },
    created() {
      this.initGrid();
    }
  });
  app.config.productionTip = false
  app.mount('#app');