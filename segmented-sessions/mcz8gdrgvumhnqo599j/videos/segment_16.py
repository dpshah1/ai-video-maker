from manim import *

class GraphTheoryScene(Scene):
    def construct(self):

        main_text = Text("The Power and Beauty of Graph Theory", font_size=36)
        main_text.to_edge(UP)

        subtitle = Text("Visualizing Concepts and Theorems", font_size=24)
        subtitle.next_to(main_text, DOWN)

        circle_a = Circle(radius=0.5)
        circle_b = Circle(radius=0.5).next_to(circle_a, RIGHT)
        circle_c = Circle(radius=0.5).next_to(circle_a, LEFT)
        circle_d = Circle(radius=0.5).next_to(circle_b, RIGHT)

        self.play(Write(main_text))
        self.wait(1)
        self.play(Write(subtitle))
        self.wait(1)
        self.play(Create(circle_a))
        self.play(Create(circle_b))
        self.play(Create(circle_c))
        self.play(Create(circle_d))
        self.wait(8.6)  # Wait to complete the 11.6 seconds