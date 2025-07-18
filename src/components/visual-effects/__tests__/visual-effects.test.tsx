import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  StarfieldBackground,
  FloatingOrbs,
  AnimatedGradient,
  MagicalBorder,
} from '../index';

// Mock canvas context for StarfieldBackground tests
const mockGetContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillStyle: '',
  globalAlpha: 1,
  shadowBlur: 0,
  shadowColor: '',
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
}));

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

describe('Visual Effects Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('StarfieldBackground', () => {
    it('renders canvas element', () => {
      render(<StarfieldBackground />);
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'z-0');
    });

    it('accepts custom className', () => {
      render(<StarfieldBackground className="custom-class" />);
      const canvas = document.querySelector('canvas');
      expect(canvas).toHaveClass('custom-class');
    });
  });

  describe('FloatingOrbs', () => {
    it('renders floating orbs container', () => {
      render(<FloatingOrbs />);
      const container = document.querySelector('.fixed.inset-0.pointer-events-none.z-10');
      expect(container).toBeInTheDocument();
    });

    it('renders default number of orbs', () => {
      render(<FloatingOrbs />);
      const orbs = document.querySelectorAll('.absolute.rounded-full.animate-float');
      expect(orbs).toHaveLength(6); // default orbCount
    });

    it('renders custom number of orbs', () => {
      render(<FloatingOrbs orbCount={3} />);
      const orbs = document.querySelectorAll('.absolute.rounded-full.animate-float');
      expect(orbs).toHaveLength(3);
    });

    it('accepts custom className', () => {
      render(<FloatingOrbs className="custom-orbs" />);
      const container = document.querySelector('.custom-orbs');
      expect(container).toBeInTheDocument();
    });
  });

  describe('AnimatedGradient', () => {
    it('renders gradient container', () => {
      render(<AnimatedGradient />);
      const container = document.querySelector('.fixed.inset-0.pointer-events-none.z-5');
      expect(container).toBeInTheDocument();
    });

    it('accepts custom className', () => {
      render(<AnimatedGradient className="custom-gradient" />);
      const container = document.querySelector('.custom-gradient');
      expect(container).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<AnimatedGradient variant="aurora" />);
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();

      rerender(<AnimatedGradient variant="mystical" />);
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();

      rerender(<AnimatedGradient variant="ethereal" />);
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();

      rerender(<AnimatedGradient variant="cosmic" />);
      expect(document.querySelector('.fixed.inset-0')).toBeInTheDocument();
    });
  });

  describe('MagicalBorder', () => {
    it('renders with children', () => {
      render(
        <MagicalBorder>
          <div data-testid="child-content">Test Content</div>
        </MagicalBorder>
      );
      
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('accepts custom className', () => {
      render(
        <MagicalBorder className="custom-border">
          <div>Content</div>
        </MagicalBorder>
      );
      
      const container = document.querySelector('.custom-border');
      expect(container).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(
        <MagicalBorder variant="ornate">
          <div>Content</div>
        </MagicalBorder>
      );
      
      let container = document.querySelector('.magical-border-container');
      expect(container).toBeInTheDocument();

      rerender(
        <MagicalBorder variant="simple">
          <div>Content</div>
        </MagicalBorder>
      );
      
      container = document.querySelector('.magical-border-container');
      expect(container).toBeInTheDocument();

      rerender(
        <MagicalBorder variant="elegant">
          <div>Content</div>
        </MagicalBorder>
      );
      
      container = document.querySelector('.magical-border-container');
      expect(container).toBeInTheDocument();

      rerender(
        <MagicalBorder variant="runes">
          <div>Content</div>
        </MagicalBorder>
      );
      
      container = document.querySelector('.magical-border-container');
      expect(container).toBeInTheDocument();
    });

    it('renders ornate decorations for ornate variant', () => {
      render(
        <MagicalBorder variant="ornate">
          <div>Content</div>
        </MagicalBorder>
      );
      
      const corners = document.querySelectorAll('.magical-corner');
      const edges = document.querySelectorAll('.magical-edge');
      
      expect(corners).toHaveLength(4); // top-left, top-right, bottom-left, bottom-right
      expect(edges).toHaveLength(4); // top, right, bottom, left
    });

    it('applies animated class when animated prop is true', () => {
      render(
        <MagicalBorder animated={true}>
          <div>Content</div>
        </MagicalBorder>
      );
      
      const container = document.querySelector('.magical-border-container.animated');
      expect(container).toBeInTheDocument();
    });

    it('does not apply animated class when animated prop is false', () => {
      render(
        <MagicalBorder animated={false}>
          <div>Content</div>
        </MagicalBorder>
      );
      
      const container = document.querySelector('.magical-border-container');
      expect(container).toBeInTheDocument();
      expect(container).not.toHaveClass('animated');
    });
  });
});

describe('Visual Effects Integration', () => {
  it('all components can be rendered together', () => {
    render(
      <div>
        <StarfieldBackground />
        <FloatingOrbs />
        <AnimatedGradient />
        <MagicalBorder>
          <div data-testid="integrated-content">All effects working</div>
        </MagicalBorder>
      </div>
    );

    expect(document.querySelector('canvas')).toBeInTheDocument();
    expect(document.querySelectorAll('.absolute.rounded-full')).toHaveLength(6);
    expect(document.querySelector('.fixed.inset-0.pointer-events-none.z-5')).toBeInTheDocument();
    expect(screen.getByTestId('integrated-content')).toBeInTheDocument();
  });
});